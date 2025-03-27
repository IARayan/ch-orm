import { Connection } from "../connection/Connection";
import { Schema } from "./Schema";

/**
 * Abstract base class for database migrations
 * Provides structure and common functionality for migrations
 */
export abstract class Migration {
  /**
   * Schema instance for database operations
   */
  protected schema: Schema;

  /**
   * Connection instance for direct database access
   */
  protected connection: Connection;

  /**
   * Migration name (derived from class name)
   */
  public readonly name: string;

  /**
   * Indicates if migration has been applied
   */
  private applied: boolean = false;

  /**
   * Create a new Migration instance
   * @param connection - ClickHouse connection
   */
  constructor(connection: Connection) {
    this.connection = connection;
    this.schema = new Schema(connection);
    this.name = this.constructor.name;
  }

  /**
   * Abstract method to be implemented by concrete migrations for applying changes
   * This contains the forward migration logic
   */
  public abstract up(): Promise<void>;

  /**
   * Abstract method to be implemented by concrete migrations for reverting changes
   * This contains the rollback migration logic
   */
  public abstract down(): Promise<void>;

  /**
   * Apply the migration
   * @returns Promise that resolves when the migration is applied
   */
  public async apply(): Promise<void> {
    if (this.applied) {
      throw new Error(`Migration ${this.name} has already been applied`);
    }

    try {
      // Apply the migration
      await this.up();

      // Mark as applied
      this.applied = true;
    } catch (error) {
      throw new Error(`Failed to apply migration ${this.name}: ${error}`);
    }
  }

  /**
   * Revert the migration
   * @returns Promise that resolves when the migration is reverted
   */
  public async revert(): Promise<void> {
    if (!this.applied) {
      throw new Error(`Migration ${this.name} has not been applied yet`);
    }

    try {
      // Revert the migration
      await this.down();

      // Mark as not applied
      this.applied = false;
    } catch (error) {
      throw new Error(`Failed to revert migration ${this.name}: ${error}`);
    }
  }

  /**
   * Get the migration name
   * @returns Migration name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Check if the migration has been applied
   * @returns True if the migration has been applied, false otherwise
   */
  public isApplied(): boolean {
    return this.applied;
  }

  /**
   * Set the applied state of the migration
   * @param state - Applied state
   */
  public setApplied(state: boolean): void {
    this.applied = state;
  }
}
