import { ClickHouseConnection } from "../connection/ClickHouseConnection";
import { Migration } from "./Migration";
import { Schema } from "./Schema";
import { MigrationRecord } from "./models/MigrationRecord";

/**
 * MigrationRunner class for managing migration execution
 * Handles applying and rolling back migrations
 */
export class MigrationRunner {
  /**
   * Connection to the database
   */
  private connection: ClickHouseConnection;

  /**
   * Schema instance for database operations
   */
  private schema: Schema;

  /**
   * Name of the migrations table
   */
  private migrationsTable: string = "migrations";

  /**
   * Array of migrations to be applied or rolled back
   */
  private migrations: Migration[] = [];

  /**
   * Create a new MigrationRunner instance
   * @param connection - ClickHouse connection
   */
  constructor(connection: ClickHouseConnection) {
    this.connection = connection;
    this.schema = new Schema(connection);
    // Set the connection for the model
    MigrationRecord.setConnection(connection);
  }

  /**
   * Set the name of the migrations table
   * @param tableName - Migrations table name
   * @returns MigrationRunner instance for chaining
   */
  public setMigrationsTable(tableName: string): this {
    this.migrationsTable = tableName;
    return this;
  }

  /**
   * Add a migration to the runner
   * @param migration - Migration instance
   * @returns MigrationRunner instance for chaining
   */
  public add(migration: Migration): this {
    this.migrations.push(migration);
    return this;
  }

  /**
   * Add multiple migrations to the runner
   * @param migrations - Array of migration instances
   * @returns MigrationRunner instance for chaining
   */
  public addMultiple(migrations: Migration[]): this {
    this.migrations = [...this.migrations, ...migrations];
    return this;
  }

  /**
   * Set the migrations for the runner
   * @param migrations - Array of migration instances
   * @returns MigrationRunner instance for chaining
   */
  public setMigrations(migrations: Migration[]): this {
    this.migrations = migrations;
    return this;
  }

  /**
   * Ensure the migrations table exists
   * @returns Promise that resolves when the migrations table is created (if needed)
   */
  private async ensureMigrationsTable(): Promise<void> {
    try {
      // Try to query the migrations table to check if it exists
      await MigrationRecord.query().limit(1).get();
    } catch (error) {
      // If the table doesn't exist, create it
      await this.schema.create(this.migrationsTable, (table) => {
        // Define columns matching the MigrationRecord model
        table.string("name");
        table.uint32("batch");
        table.float64("execution_time", { nullable: true });
        table.dateTime("created_at");

        // Set the engine to ReplacingMergeTree
        table.replacingMergeTree();

        // In ClickHouse, the ORDER BY key is effectively the primary key
        table.orderBy("name");
      });
    }
  }

  /**
   * Get all migration records from the database
   * @returns Promise that resolves to array of migration records
   */
  public async getMigrationRecords(): Promise<MigrationRecord[]> {
    await this.ensureMigrationsTable();

    // Use the MigrationRecord model to get all records
    const records = await MigrationRecord.query()
      .orderBy("created_at", "ASC")
      .get();

    return records as MigrationRecord[];
  }

  /**
   * Get the last batch number from the migration records
   * @returns Promise that resolves to the last batch number or 0 if no migrations have been run
   */
  private async getLastBatchNumber(): Promise<number> {
    // Use the MigrationRecord model to get the max batch number
    const result = await MigrationRecord.query().max("batch");
    const maxBatch = result[0]?.["max(batch)"];
    return maxBatch || 0;
  }

  /**
   * Save a migration record to the database
   * @param migration - Migration instance
   * @param batch - Batch number
   * @param executionTime - Execution time in seconds
   * @returns Promise that resolves when the record is saved
   */
  private async saveMigrationRecord(
    migration: Migration,
    batch: number,
    executionTime: number
  ): Promise<void> {
    // Create a new MigrationRecord instance
    await MigrationRecord.createAndSave({
      name: migration.getName(),
      batch,
      execution_time: executionTime,
      created_at: new Date(),
    });
  }

  /**
   * Delete a migration record from the database
   * @param migration - Migration instance
   * @returns Promise that resolves when the record is deleted
   */
  private async deleteMigrationRecord(migration: Migration): Promise<void> {
    // Use the MigrationRecord model to delete the record
    await MigrationRecord.query().where("name", migration.getName()).delete();
  }

  /**
   * Run pending migrations
   * @returns Promise that resolves to number of migrations applied
   */
  public async run(): Promise<number> {
    await this.ensureMigrationsTable();

    // Get existing migration records
    const existingRecords = await this.getMigrationRecords();
    const existingNames = existingRecords.map((record) => record.name);

    // Get pending migrations
    const pendingMigrations = this.migrations.filter(
      (migration) => !existingNames.includes(migration.getName())
    );

    if (pendingMigrations.length === 0) {
      return 0;
    }

    // Get the next batch number
    const nextBatch = (await this.getLastBatchNumber()) + 1;

    // Apply each pending migration
    let appliedCount = 0;

    for (const migration of pendingMigrations) {
      const startTime = process.hrtime();

      // Apply the migration
      await migration.apply();

      // Calculate execution time
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const executionTime = seconds + nanoseconds / 1e9;

      // Save the migration record
      await this.saveMigrationRecord(migration, nextBatch, executionTime);

      // Update the applied count
      appliedCount++;
    }

    return appliedCount;
  }

  /**
   * Rollback the last batch of migrations
   * @returns Promise that resolves to number of migrations rolled back
   */
  public async rollback(): Promise<number> {
    await this.ensureMigrationsTable();

    // Get the last batch number
    const lastBatch = await this.getLastBatchNumber();

    if (lastBatch === 0) {
      return 0;
    }

    // Get records from the last batch using the model
    const recordsToRollback = await MigrationRecord.query()
      .where("batch", lastBatch)
      .orderBy("created_at", "DESC")
      .get();

    if (recordsToRollback.length === 0) {
      return 0;
    }

    // Find the corresponding migration instances
    const migrationsToRollback = recordsToRollback
      .map((record) => this.migrations.find((m) => m.getName() === record.name))
      .filter((m): m is Migration => m !== undefined);

    // Set these migrations as applied
    migrationsToRollback.forEach((migration) => migration.setApplied(true));

    // Rollback each migration
    let rolledBackCount = 0;

    for (const migration of migrationsToRollback) {
      // Rollback the migration
      await migration.revert();

      // Delete the migration record
      await this.deleteMigrationRecord(migration);

      // Update the rolled back count
      rolledBackCount++;
    }

    return rolledBackCount;
  }

  /**
   * Reset the database by rolling back all migrations
   * @returns Promise that resolves to number of migrations rolled back
   */
  public async reset(): Promise<number> {
    await this.ensureMigrationsTable();

    // Get all migration records ordered by created_at in reverse order using the model
    const recordsToRollback = await MigrationRecord.query()
      .orderBy("created_at", "DESC")
      .get();

    if (recordsToRollback.length === 0) {
      return 0;
    }

    // Find the corresponding migration instances
    const migrationsToRollback = recordsToRollback
      .map((record) => this.migrations.find((m) => m.getName() === record.name))
      .filter((m): m is Migration => m !== undefined);

    // Set these migrations as applied
    migrationsToRollback.forEach((migration) => migration.setApplied(true));

    // Rollback each migration
    let rolledBackCount = 0;

    for (const migration of migrationsToRollback) {
      // Rollback the migration
      await migration.revert();

      // Delete the migration record
      await this.deleteMigrationRecord(migration);

      // Update the rolled back count
      rolledBackCount++;
    }

    return rolledBackCount;
  }

  /**
   * Refresh the database by rolling back all migrations and then running them again
   * @returns Promise that resolves to number of migrations applied
   */
  public async refresh(): Promise<number> {
    // Reset the database
    await this.reset();

    // Run all migrations
    return this.run();
  }

  /**
   * Get array of pending migrations
   * @returns Promise that resolves to array of pending migration names
   */
  public async getPendingMigrations(): Promise<string[]> {
    const existingRecords = await this.getMigrationRecords();
    const existingNames = existingRecords.map((record) => record.name);

    return this.migrations
      .filter((migration) => !existingNames.includes(migration.getName()))
      .map((migration) => migration.getName());
  }

  /**
   * Get array of all migration names
   * @returns Array of all migration names
   */
  public getMigrationNames(): string[] {
    return this.migrations.map((migration) => migration.getName());
  }

  /**
   * Get the underlying connection instance
   * @returns ClickHouseConnection instance
   */
  public getConnection(): ClickHouseConnection {
    return this.connection;
  }
}
