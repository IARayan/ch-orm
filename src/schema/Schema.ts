import { Connection } from "../connection/Connection";
import { Blueprint } from "./Blueprint";

/**
 * Schema class for managing database schema
 * Used for creating and modifying tables, views, and other database objects
 */
export class Schema {
  /**
   * Database connection
   */
  private connection: Connection;

  /**
   * Create a new Schema instance
   * @param connection - ClickHouse connection
   */
  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Create a new table
   * @param table - Table name
   * @param callback - Callback function to define table structure using Blueprint
   * @returns Promise that resolves when the table is created
   */
  public async create(
    table: string,
    callback: (blueprint: Blueprint) => void
  ): Promise<void> {
    // Create blueprint for the table
    const blueprint = new Blueprint(table);

    // Call the callback to set up the blueprint
    callback(blueprint);

    // Execute the create table SQL
    await this.connection.query(blueprint.toSql());
  }

  /**
   * Drop a table
   * @param table - Table name
   * @param ifExists - Whether to include IF EXISTS in the query
   * @returns Promise that resolves when the table is dropped
   */
  public async drop(table: string, ifExists: boolean = true): Promise<void> {
    // Create blueprint for generating drop SQL
    const blueprint = new Blueprint(table);

    // Execute the drop table SQL
    await this.connection.query(blueprint.toDropSql(ifExists));
  }

  /**
   * Drop a table if it exists and create a new one
   * @param table - Table name
   * @param callback - Callback function to define table structure using Blueprint
   * @returns Promise that resolves when the table is recreated
   */
  public async createOrReplace(
    table: string,
    callback: (blueprint: Blueprint) => void
  ): Promise<void> {
    // Drop the table if it exists
    await this.drop(table, true);

    // Create the table
    await this.create(table, callback);
  }

  /**
   * Check if a table exists
   * @param table - Table name
   * @returns Promise that resolves to true if the table exists, false otherwise
   */
  public async hasTable(table: string): Promise<boolean> {
    try {
      const result = await this.connection.query(`
        SELECT 1
        FROM system.tables
        WHERE database = currentDatabase()
        AND name = '${table}'
      `);

      return result.data.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get information about a table
   * @param table - Table name
   * @returns Promise that resolves to table information or null if not found
   */
  public async getTable(table: string): Promise<any | null> {
    try {
      const result = await this.connection.query(`
        SELECT *
        FROM system.tables
        WHERE database = currentDatabase()
        AND name = '${table}'
      `);

      return result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all columns in a table
   * @param table - Table name
   * @returns Promise that resolves to array of column information
   */
  public async getColumns(table: string): Promise<any[]> {
    try {
      const result = await this.connection.query(`
        SELECT *
        FROM system.columns
        WHERE database = currentDatabase()
        AND table = '${table}'
      `);

      return result.data;
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if a column exists in a table
   * @param table - Table name
   * @param column - Column name
   * @returns Promise that resolves to true if the column exists, false otherwise
   */
  public async hasColumn(table: string, column: string): Promise<boolean> {
    try {
      const result = await this.connection.query(`
        SELECT 1
        FROM system.columns
        WHERE database = currentDatabase()
        AND table = '${table}'
        AND name = '${column}'
      `);

      return result.data.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create a materialized view
   * @param viewName - View name
   * @param selectQuery - SELECT query for the view
   * @param toTable - Target table (optional)
   * @param engine - Engine for the view (if not using TO table)
   * @returns Promise that resolves when the view is created
   */
  public async createMaterializedView(
    viewName: string,
    selectQuery: string,
    toTable?: string,
    engine?: string
  ): Promise<void> {
    let sql = `CREATE MATERIALIZED VIEW IF NOT EXISTS ${viewName}`;

    // Add engine or TO table
    if (toTable) {
      sql += ` TO ${toTable}`;
    } else if (engine) {
      sql += ` ENGINE = ${engine}`;
    } else {
      throw new Error(
        "Either toTable or engine must be provided for materialized view"
      );
    }

    // Add select query
    sql += ` AS ${selectQuery}`;

    await this.connection.query(sql);
  }

  /**
   * Drop a materialized view
   * @param viewName - View name
   * @param ifExists - Whether to include IF EXISTS in the query
   * @returns Promise that resolves when the view is dropped
   */
  public async dropMaterializedView(
    viewName: string,
    ifExists: boolean = true
  ): Promise<void> {
    const sql = `DROP MATERIALIZED VIEW ${
      ifExists ? "IF EXISTS" : ""
    } ${viewName}`;
    await this.connection.query(sql);
  }

  /**
   * Create a view
   * @param viewName - View name
   * @param selectQuery - SELECT query for the view
   * @returns Promise that resolves when the view is created
   */
  public async createView(
    viewName: string,
    selectQuery: string
  ): Promise<void> {
    const sql = `CREATE VIEW IF NOT EXISTS ${viewName} AS ${selectQuery}`;
    await this.connection.query(sql);
  }

  /**
   * Drop a view
   * @param viewName - View name
   * @param ifExists - Whether to include IF EXISTS in the query
   * @returns Promise that resolves when the view is dropped
   */
  public async dropView(
    viewName: string,
    ifExists: boolean = true
  ): Promise<void> {
    const sql = `DROP VIEW ${ifExists ? "IF EXISTS" : ""} ${viewName}`;
    await this.connection.query(sql);
  }

  /**
   * Create a dictionary
   * @param dictionaryName - Dictionary name
   * @param structure - Dictionary structure
   * @param source - Dictionary source
   * @param layout - Dictionary layout
   * @param lifetime - Dictionary lifetime
   * @returns Promise that resolves when the dictionary is created
   */
  public async createDictionary(
    dictionaryName: string,
    structure: string,
    source: string,
    layout: string,
    lifetime: string
  ): Promise<void> {
    const sql = `
      CREATE DICTIONARY IF NOT EXISTS ${dictionaryName}
      (
        ${structure}
      )
      PRIMARY KEY id
      SOURCE(${source})
      LAYOUT(${layout})
      LIFETIME(${lifetime})
    `;

    await this.connection.query(sql);
  }

  /**
   * Drop a dictionary
   * @param dictionaryName - Dictionary name
   * @param ifExists - Whether to include IF EXISTS in the query
   * @returns Promise that resolves when the dictionary is dropped
   */
  public async dropDictionary(
    dictionaryName: string,
    ifExists: boolean = true
  ): Promise<void> {
    const sql = `DROP DICTIONARY ${
      ifExists ? "IF EXISTS" : ""
    } ${dictionaryName}`;
    await this.connection.query(sql);
  }

  /**
   * Create a database
   * @param databaseName - Database name
   * @param ifNotExists - Whether to include IF NOT EXISTS in the query
   * @returns Promise that resolves when the database is created
   */
  public async createDatabase(
    databaseName: string,
    ifNotExists: boolean = true
  ): Promise<void> {
    const sql = `CREATE DATABASE ${
      ifNotExists ? "IF NOT EXISTS" : ""
    } ${databaseName}`;
    await this.connection.query(sql);
  }

  /**
   * Drop a database
   * @param databaseName - Database name
   * @param ifExists - Whether to include IF EXISTS in the query
   * @returns Promise that resolves when the database is dropped
   */
  public async dropDatabase(
    databaseName: string,
    ifExists: boolean = true
  ): Promise<void> {
    const sql = `DROP DATABASE ${ifExists ? "IF EXISTS" : ""} ${databaseName}`;
    await this.connection.query(sql);
  }

  /**
   * Execute raw SQL
   * @param sql - SQL query
   * @returns Promise that resolves with the query result
   */
  public async raw(sql: string): Promise<any> {
    return this.connection.query(sql);
  }

  /**
   * Alter a table
   * @param table - Table name
   * @param callback - Callback function to define table alterations using Blueprint
   * @returns Promise that resolves when the table is altered
   */
  public async alter(
    table: string,
    callback: (blueprint: Blueprint) => void
  ): Promise<void> {
    // Create blueprint for the table
    const blueprint = new Blueprint(table);

    // Set the altering context
    blueprint.setAltering(true);

    // Call the callback to set up the blueprint
    callback(blueprint);

    // Execute the alter table SQL
    await this.connection.query(blueprint.toAlterSql());
  }
}
