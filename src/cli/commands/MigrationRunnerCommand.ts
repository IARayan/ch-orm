import * as fs from "fs";
import * as path from "path";
import { ClickHouseConnection } from "../../connection/ClickHouseConnection";
import { MigrationRunner } from "../../schema/MigrationRunner";
import { MigrationRecord } from "../../schema/models/MigrationRecord";

/**
 * Command for running migrations via CLI
 */
export class MigrationRunnerCommand {
  private runner: MigrationRunner;
  private migrationsDir: string;
  // Map of filename to migration instance
  private migrationInstances: Map<string, any> = new Map();

  constructor(
    connection: ClickHouseConnection,
    migrationsDir: string = "./migrations"
  ) {
    this.migrationsDir = migrationsDir;
    this.runner = new MigrationRunner(connection);

    // Set connection for the MigrationRecord model
    MigrationRecord.setConnection(connection);
  }

  /**
   * Load a migration file by filename
   * @param filename Migration filename
   * @returns Migration instance
   */
  private async loadMigration(filename: string): Promise<any> {
    if (this.migrationInstances.has(filename)) {
      return this.migrationInstances.get(filename);
    }

    const filePath = path.resolve(this.migrationsDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Migration file not found: ${filename}`);
    }

    // Try ESM import first
    try {
      const migration = await import(filePath);
      const MigrationClass = migration.default;
      if (MigrationClass) {
        const instance = new MigrationClass(this.runner.getConnection());
        // Override the getName method to return the filename
        const originalGetName = instance.getName.bind(instance);
        instance.getName = () => filename;

        // Store for reuse
        this.migrationInstances.set(filename, instance);
        return instance;
      }
    } catch (error) {
      // If ESM import fails, try CommonJS require with ts-node
      try {
        // Register ts-node if not already registered
        if (!require.extensions[".ts"]) {
          require("ts-node").register({
            transpileOnly: true,
            compilerOptions: {
              module: "CommonJS",
              esModuleInterop: true,
            },
          });
        }

        const migration = require(filePath);
        // For CommonJS, find the class in the exports
        let MigrationClass = migration.default;

        // If no default export, look for named exports
        if (!MigrationClass) {
          for (const key in migration) {
            if (
              typeof migration[key] === "function" &&
              migration[key].prototype &&
              typeof migration[key].prototype.up === "function" &&
              typeof migration[key].prototype.down === "function"
            ) {
              MigrationClass = migration[key];
              break;
            }
          }
        }

        if (MigrationClass) {
          const instance = new MigrationClass(this.runner.getConnection());
          // Override the getName method to return the filename
          const originalGetName = instance.getName.bind(instance);
          instance.getName = () => filename;

          // Store for reuse
          this.migrationInstances.set(filename, instance);
          return instance;
        }
      } catch (requireError: any) {
        throw new Error(
          `Failed to load migration file ${filename}: ${
            requireError?.message || "Unknown error"
          }`
        );
      }
    }

    throw new Error(`No migration class found in ${filename}`);
  }

  /**
   * Get all completed migrations
   */
  public async getCompletedMigrations(): Promise<string[]> {
    // Use the MigrationRecord model to get all completed migrations
    const records = await MigrationRecord.query().get();
    return records.map((record) => record.name);
  }

  /**
   * Get migrations for rollback
   */
  public async getMigrationsForRollback(steps: number = 1): Promise<string[]> {
    // Use the MigrationRecord model to get migrations for rollback
    const records = await MigrationRecord.query()
      .orderBy("created_at", "DESC")
      .limit(steps)
      .get();

    return records.map((record) => record.name);
  }

  /**
   * Run a specific migration
   */
  public async runMigration(filename: string): Promise<void> {
    // Load the migration
    const instance = await this.loadMigration(filename);

    // Add it to the runner
    this.runner.add(instance);

    // Run it
    await this.runner.run();
  }

  /**
   * Rollback a specific migration
   */
  public async rollbackMigration(filename: string): Promise<void> {
    // Load the migration
    const instance = await this.loadMigration(filename);

    // Add it to the runner
    this.runner.add(instance);

    // Mark it as applied (so it can be rolled back)
    instance.setApplied(true);

    // Roll it back
    await instance.revert();

    // Delete the migration record from the database
    await MigrationRecord.query().where("name", filename).delete();
  }

  /**
   * Get migration status
   */
  public async getMigrationStatus(): Promise<
    Array<{ migration: string; status: string }>
  > {
    const completedMigrationNames = await this.getCompletedMigrations();
    const files = fs.readdirSync(this.migrationsDir);

    return files.map((file) => {
      return {
        migration: file,
        status: completedMigrationNames.includes(file)
          ? "Completed"
          : "Pending",
      };
    });
  }

  /**
   * Run all pending migrations
   */
  public async run(): Promise<void> {
    const status = await this.getMigrationStatus();
    const pending = status.filter((s) => s.status === "Pending");

    for (const { migration } of pending) {
      await this.runMigration(migration);
    }
  }

  /**
   * Rollback migrations
   */
  public async rollback(): Promise<void> {
    // Get the last batch number
    const lastBatchResult = await MigrationRecord.query()
      .select("batch")
      .orderBy("batch", "DESC")
      .first();

    if (!lastBatchResult) {
      return; // No migrations to roll back
    }

    const lastBatch = lastBatchResult.batch;

    // Get all migrations from the last batch
    const migrationsToRollback = await MigrationRecord.query()
      .where("batch", lastBatch)
      .orderBy("created_at", "DESC") // Roll back in reverse order of creation
      .get();

    if (migrationsToRollback.length === 0) {
      return; // No migrations to roll back
    }

    // Load and roll back each migration in the batch
    for (const migrationRecord of migrationsToRollback) {
      try {
        await this.rollbackMigration(migrationRecord.name);
      } catch (error: any) {
        throw new Error(
          `Failed to roll back migration ${migrationRecord.name}: ${error.message}`
        );
      }
    }
  }

  /**
   * Reset the database by rolling back all migrations
   */
  public async reset(): Promise<void> {
    const completedMigrationFilenames = await this.getCompletedMigrations();
    if (completedMigrationFilenames.length === 0) {
      return; // No migrations to reset
    }

    // For each completed migration, load and add it to the runner
    for (const filename of completedMigrationFilenames) {
      try {
        const instance = await this.loadMigration(filename);
        this.runner.add(instance);
        instance.setApplied(true);
      } catch (error: any) {
        throw new Error(
          `Failed to load migration ${filename}: ${error.message}`
        );
      }
    }

    // Execute reset to roll back all migrations
    await this.runner.reset();
  }

  /**
   * Fresh install - drops all database objects and runs migrations from scratch
   */
  public async fresh(): Promise<void> {
    // Get the connection to execute raw queries
    const connection = this.runner.getConnection();

    try {
      // 1. Get list of all tables in the current database
      const result = await connection.query(`
        SELECT name, database
        FROM system.tables
        WHERE database = currentDatabase()
          AND name != 'migrations'  -- Keep the migrations table for now
          AND NOT startsWith(name, '.inner')  -- Skip internal system tables
      `);

      const tables = result.data.map((row: any) => ({
        name: row.name,
        database: row.database,
      }));

      // 2. Get list of all materialized views
      const viewsResult = await connection.query(`
        SELECT name, database
        FROM system.tables
        WHERE database = currentDatabase()
          AND engine = 'MaterializedView'
      `);

      const views = viewsResult.data.map((row: any) => ({
        name: row.name,
        database: row.database,
      }));

      // Count of inner tables (for reporting only)
      const innerTablesResult = await connection.query(`
        SELECT count() as count
        FROM system.tables
        WHERE database = currentDatabase()
          AND startsWith(name, '.inner')
      `);
      const innerTablesCount = innerTablesResult.data[0]?.count || 0;

      // 3. Drop all materialized views first (they depend on tables)
      for (const view of views) {
        // Properly escape view names with backticks
        await connection.query(
          `DROP VIEW IF EXISTS \`${view.database}\`.\`${view.name}\``
        );
      }

      // 4. Drop all tables
      for (const table of tables) {
        if (table.name !== "migrations") {
          // Extra safety check
          // Properly escape table names with backticks
          await connection.query(
            `DROP TABLE IF EXISTS \`${table.database}\`.\`${table.name}\``
          );
        }
      }

      // 5. Check if migrations table exists and delete all records
      const migrationTableExistsResult = await connection.query(`
        SELECT count() as count
        FROM system.tables
        WHERE database = currentDatabase()
          AND name = 'migrations'
      `);

      const migrationsTableExists =
        migrationTableExistsResult.data[0]?.count > 0;

      if (migrationsTableExists) {
        // Using the model to delete all migration records
        await MigrationRecord.query().where("1", "=", "1").deleteQuery();

        // Double-check that the records are gone
        const countCheck = await MigrationRecord.query().count();
        if (countCheck > 0) {
          // If model-based deletion didn't work, try direct SQL
          await connection.query(`DELETE FROM \`migrations\` WHERE 1=1`);
        }
      } else {
        // Create migrations table if it doesn't exist
        await connection.query(`
          CREATE TABLE IF NOT EXISTS \`migrations\` (
            name String,
            batch UInt32,
            execution_time Float64,
            created_at DateTime
          ) ENGINE = MergeTree()
          ORDER BY (name)
        `);
      }

      // Verify migrations are clear before running new ones
      const migrationRecords = await MigrationRecord.query().get();
      if (migrationRecords.length > 0) {
        throw new Error("Migration records could not be cleared");
      }

      // 6. Run all migrations from scratch
      await this.run();

      // Final verification
      await this.getMigrationStatus();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Refresh the database by rolling back all migrations and then running them again
   */
  public async refresh(): Promise<void> {
    // First reset all migrations
    await this.reset();

    // Then run all migrations again
    await this.run();
  }
}
