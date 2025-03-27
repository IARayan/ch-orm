import { DataTypes } from "../../constants/Types";
import { Column, Table } from "../../decorators/ModelDecorators";
import { Model } from "../../model/Model";

/**
 * Model representing a migration record in the migrations table
 * Used to track which migrations have been applied to the database
 */
@Table("migrations")
export class MigrationRecord extends Model {
  /**
   * Name of the migration
   * Typically the class name of the migration
   */
  @Column({
    type: DataTypes.STRING,
    primary: true,
    comment: "Name of the migration",
  })
  name: string = "";

  /**
   * Batch number of the migration
   * Migrations are grouped in batches for easier rollback
   */
  @Column({
    type: DataTypes.UINT32,
    comment: "Batch number of the migration",
  })
  batch: number = 0;

  /**
   * Execution time of the migration in seconds
   * Optional field to track migration performance
   */
  @Column({
    type: DataTypes.FLOAT64,
    nullable: true,
    comment: "Execution time of the migration in seconds",
  })
  execution_time?: number;

  /**
   * Timestamp when the migration was created/applied
   */
  @Column({
    type: DataTypes.DATETIME,
    comment: "Timestamp when the migration was created/applied",
  })
  created_at: Date = new Date();
}
