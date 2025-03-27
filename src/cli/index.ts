#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import * as dotenv from "dotenv";
import figlet from "figlet";
import * as fs from "fs";
import ora from "ora";
import * as path from "path";
import { ClickHouseConnection } from "../connection/ClickHouseConnection";
import { MigrationRecord } from "../schema/models/MigrationRecord";
import {
  MakeMigrationCommand,
  MigrationRunnerCommand,
  ModelCommand,
  SeederCommand,
} from "./commands";

/**
 * Load configuration from environment variables or .env file
 */
function loadConfig() {
  // Load environment variables from .env file if it exists
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  // Get configuration from environment variables
  const config = {
    host: process.env.CLICKHOUSE_HOST || "localhost",
    port: parseInt(process.env.CLICKHOUSE_PORT || "8123", 10),
    database: process.env.CLICKHOUSE_DATABASE || "default",
    username: process.env.CLICKHOUSE_USERNAME || "default",
    password: process.env.CLICKHOUSE_PASSWORD || "",
    protocol: process.env.CLICKHOUSE_PROTOCOL || "http",
    debug: process.env.CLICKHOUSE_DEBUG === "true",
    migrationsPath: process.env.CLICKHOUSE_MIGRATIONS_PATH || "./migrations",
    modelsPath: process.env.CLICKHOUSE_MODELS_PATH || "./models",
    seedersPath: process.env.CLICKHOUSE_SEEDERS_PATH || "./seeders",
  };

  return config;
}

/**
 * Create a ClickHouse connection from configuration
 */
function createConnection(config: any) {
  return new ClickHouseConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    debug: config.debug,
  });
}

/**
 * Main CLI program
 */
async function main() {
  console.log(
    chalk.cyan(figlet.textSync("CH-ORM", { horizontalLayout: "full" }))
  );
  console.log(chalk.yellow("A Developer-First ClickHouse ORM\n"));

  const program = new Command();
  const config = loadConfig();

  program.version("1.0.0").description("CH-ORM CLI for database management");

  // Migrations
  const migrationsCommand = program
    .command("migrations")
    .description("Manage database migrations");

  migrationsCommand
    .command("create <name>")
    .description("Create a new migration file")
    .option(
      "-p, --path <path>",
      "Path to migrations directory",
      config.migrationsPath
    )
    .action(async (name, options) => {
      const spinner = ora("Creating migration...").start();

      try {
        const makeMigration = new MakeMigrationCommand(options.path);
        const filePath = makeMigration.execute(name);
        spinner.succeed(`Migration created: ${chalk.green(filePath)}`);
      } catch (error: any) {
        spinner.fail(`Failed to create migration: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  migrationsCommand
    .command("run")
    .description("Run all pending migrations")
    .option(
      "-p, --path <path>",
      "Path to migrations directory",
      config.migrationsPath
    )
    .action(async (options) => {
      const spinner = ora("Running migrations...").start();

      try {
        const connection = createConnection(config);
        const runner = new MigrationRunnerCommand(connection, options.path);
        const status = await runner.getMigrationStatus();
        const pending = status.filter((s) => s.status === "Pending");

        if (pending.length === 0) {
          spinner.succeed("No pending migrations");
          return;
        }

        spinner.info(`Found ${pending.length} pending migrations`);
        await runner.run();
        spinner.succeed(`Successfully ran ${pending.length} migrations`);
      } catch (error: any) {
        spinner.fail(`Migration failed: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  migrationsCommand
    .command("rollback")
    .description("Rollback the last batch of migrations")
    .option(
      "-p, --path <path>",
      "Path to migrations directory",
      config.migrationsPath
    )
    .action(async (options) => {
      const spinner = ora("Rolling back migrations...").start();

      try {
        const connection = createConnection(config);
        const runner = new MigrationRunnerCommand(connection, options.path);

        // Get the last batch number
        const lastBatchResult = await MigrationRecord.query()
          .select("batch")
          .orderBy("batch", "DESC")
          .first();

        if (!lastBatchResult) {
          spinner.succeed("No migrations to rollback");
          return;
        }

        const lastBatch = lastBatchResult.batch;

        // Get all migrations from the last batch
        const migrationsToRollback = await MigrationRecord.query()
          .where("batch", lastBatch)
          .orderBy("created_at", "DESC")
          .get();

        if (migrationsToRollback.length === 0) {
          spinner.succeed("No migrations to rollback");
          return;
        }

        spinner.info(
          `Rolling back batch #${lastBatch} with ${migrationsToRollback.length} migrations:`
        );
        migrationsToRollback.forEach((record: { name: string }) => {
          console.log(`  - ${chalk.yellow(record.name)}`);
        });

        spinner.start("Executing rollback...");
        await runner.rollback();

        // Verify batch was removed from migrations table
        const verifyBatchRemoved = await MigrationRecord.query()
          .where("batch", lastBatch)
          .count();

        if (verifyBatchRemoved > 0) {
          spinner.warn(
            `Warning: ${verifyBatchRemoved} migration records still exist in the migrations table`
          );
        }

        spinner.succeed(
          `Successfully rolled back ${migrationsToRollback.length} migrations from batch #${lastBatch}`
        );
      } catch (error: any) {
        spinner.fail(`Rollback failed: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  migrationsCommand
    .command("status")
    .description("Show migration status")
    .option(
      "-p, --path <path>",
      "Path to migrations directory",
      config.migrationsPath
    )
    .action(async (options) => {
      const spinner = ora("Checking migration status...").start();

      try {
        const connection = createConnection(config);
        const runner = new MigrationRunnerCommand(connection, options.path);
        const status = await runner.getMigrationStatus();

        spinner.stop();

        if (status.length === 0) {
          console.log(chalk.yellow("No migrations found"));
          return;
        }

        console.log(chalk.yellow("\nMigration Status:"));
        console.log(chalk.cyan("Migration".padEnd(40)) + chalk.cyan("Status"));
        console.log("-".repeat(50));

        status.forEach(({ migration, status }) => {
          console.log(
            migration.padEnd(40) +
              (status === "Completed"
                ? chalk.green(status)
                : chalk.yellow(status))
          );
        });
      } catch (error: any) {
        spinner.fail(`Failed to check status: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  migrationsCommand
    .command("reset")
    .description("Rollback all migrations")
    .option(
      "-p, --path <path>",
      "Path to migrations directory",
      config.migrationsPath
    )
    .action(async (options) => {
      const spinner = ora("Rolling back all migrations...").start();

      try {
        const connection = createConnection(config);
        const runner = new MigrationRunnerCommand(connection, options.path);

        const completedMigrations = await runner.getCompletedMigrations();

        if (completedMigrations.length === 0) {
          spinner.succeed("No migrations to reset");
          return;
        }

        spinner.info(
          `Found ${completedMigrations.length} migrations to reset:`
        );
        completedMigrations.forEach((filename) => {
          console.log(`  - ${chalk.yellow(filename)}`);
        });

        spinner.start("Rolling back migrations...");
        await runner.reset();
        spinner.succeed(
          `Successfully reset ${completedMigrations.length} migrations`
        );
      } catch (error: any) {
        spinner.fail(`Reset failed: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  migrationsCommand
    .command("fresh")
    .description("Drop all tables and re-run all migrations from scratch")
    .option(
      "-p, --path <path>",
      "Path to migrations directory",
      config.migrationsPath
    )
    .action(async (options) => {
      const spinner = ora("Starting fresh installation...").start();

      try {
        const connection = createConnection(config);
        const runner = new MigrationRunnerCommand(connection, options.path);

        const status = await runner.getMigrationStatus();

        // Show information about what we're about to drop
        spinner.info(`Found ${status.length} migrations in total`);
        spinner.info(
          "Starting fresh installation - this will drop all database objects"
        );

        // This will drop all database objects and run migrations from scratch
        await runner.fresh();

        spinner.succeed(
          `Successfully completed fresh installation with ${status.length} migrations`
        );
      } catch (error: any) {
        spinner.fail(`Fresh installation failed: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  // Models
  const modelsCommand = program.command("models").description("Manage models");

  modelsCommand
    .command("create <name>")
    .description("Create a new model file")
    .option("-p, --path <path>", "Path to models directory", config.modelsPath)
    .action(async (name, options) => {
      const spinner = ora("Creating model...").start();

      try {
        const modelCommand = new ModelCommand(options.path);
        const filePath = modelCommand.execute(name);
        spinner.succeed(`Model created: ${chalk.green(filePath)}`);
      } catch (error: any) {
        spinner.fail(`Failed to create model: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  // Seeders
  const seedersCommand = program
    .command("seeders")
    .description("Manage database seeders");

  seedersCommand
    .command("create <name>")
    .description("Create a new seeder file")
    .option(
      "-p, --path <path>",
      "Path to seeders directory",
      config.seedersPath
    )
    .action(async (name, options) => {
      const spinner = ora("Creating seeder...").start();

      try {
        const seederCommand = new SeederCommand(
          createConnection(config),
          options.path
        );
        const filePath = seederCommand.createSeeder(name);
        spinner.succeed(`Seeder created: ${chalk.green(filePath)}`);
      } catch (error: any) {
        spinner.fail(`Failed to create seeder: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  seedersCommand
    .command("run")
    .description("Run database seeders")
    .option(
      "-p, --path <path>",
      "Path to seeders directory",
      config.seedersPath
    )
    .action(async (options) => {
      const spinner = ora("Running seeders...").start();

      try {
        const seederCommand = new SeederCommand(
          createConnection(config),
          options.path
        );
        await seederCommand.run();
        spinner.succeed("Database seeded successfully");
      } catch (error: any) {
        spinner.fail(`Seeding failed: ${chalk.red(error.message)}`);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

// Run the CLI
main().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});
