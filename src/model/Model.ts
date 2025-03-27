import { Connection } from "../connection/Connection";
import { ConnectionPool } from "../connection/ConnectionPool";
import { ColumnMetadata, MetadataStorage } from "../decorators/ModelDecorators";
import { QueryBuilder } from "../query/QueryBuilder";
import { QueryOptions, QueryResult } from "../types/connection";
import { snakeToCamel } from "../utils/helpers";

/**
 * Interface for connection providers that abstract the details of
 * connection management away from the Model class
 */
interface ConnectionProvider {
  getConnection(): Promise<Connection>;
  releaseConnection(connection: Connection): void;
  execute<T>(callback: (connection: Connection) => Promise<T>): Promise<T>;
}

/**
 * Base Model class with ORM functionality
 * Provides static and instance methods for interacting with ClickHouse tables
 */
export abstract class Model {
  /**
   * Connection provider for database access
   */
  private static connectionProvider: ConnectionProvider;

  /**
   * Set the database connection for all models
   * @param connection - ClickHouse connection or connection pool
   */
  public static setConnection(connection: Connection | ConnectionPool): void {
    if (connection instanceof ConnectionPool) {
      // If it's a pool, create a provider that uses the pool
      this.connectionProvider = {
        getConnection: async () => {
          return connection.getConnection();
        },
        releaseConnection: (conn: Connection) => {
          connection.releaseConnection(conn);
        },
        execute: async <T>(
          callback: (connection: Connection) => Promise<T>
        ): Promise<T> => {
          // Use the pool's withConnection method
          return connection.withConnection(callback);
        },
      };
    } else {
      // If it's a regular connection, create a simple provider
      this.connectionProvider = {
        getConnection: async () => {
          return connection;
        },
        releaseConnection: () => {
          // Do nothing, single connections don't need to be released
        },
        execute: async <T>(
          callback: (connection: Connection) => Promise<T>
        ): Promise<T> => {
          // Simply execute with the connection
          return callback(connection);
        },
      };
    }
  }

  /**
   * Get the database connection
   * @returns ClickHouse connection
   */
  protected static getConnection(): Connection {
    if (!this.connectionProvider) {
      throw new Error(
        "Database connection not set. Call Model.setConnection() first."
      );
    }

    // For backward compatibility with existing code
    return new Proxy({} as Connection, {
      get: (target, prop) => {
        return async (...args: any[]) => {
          return this.connectionProvider.execute(async (conn) => {
            return (conn as any)[prop](...args);
          });
        };
      },
    });
  }

  /**
   * Get the table name for this model
   * @returns Table name
   */
  public static getTableName(): string {
    const tableName = MetadataStorage.getTableName(this);

    if (!tableName) {
      throw new Error(
        `Table name not defined for model ${this.name}. Use @Table decorator.`
      );
    }

    return tableName;
  }

  /**
   * Get the column metadata for this model
   * @returns Map of property names to column metadata
   */
  public static getColumns(): Map<string, ColumnMetadata> {
    return MetadataStorage.getColumns(this);
  }

  /**
   * Get the primary key columns for this model
   * @returns Array of primary key column names
   */
  public static getPrimaryKeys(): string[] {
    return MetadataStorage.getPrimaryKeys(this);
  }

  /**
   * Create a new query builder for this model
   * @returns Query builder instance
   */
  public static query(): QueryBuilder {
    if (!this.connectionProvider) {
      throw new Error(`No connection set for model ${this.name}`);
    }

    // For a query builder, we need to use the proxied connection
    const connection = this.getConnection();
    return new QueryBuilder(connection, this.getTableName());
  }

  /**
   * Get all records from the table
   * @param options - Query options
   * @returns Promise that resolves to array of model instances
   */
  public static async all<T extends Model>(
    options?: QueryOptions
  ): Promise<T[]> {
    const modelClass = this as unknown as typeof Model;

    return this.connectionProvider.execute(async (connection) => {
      const qb = new QueryBuilder(connection, modelClass.getTableName());
      const records = await qb.get(options);
      return modelClass.hydrate<T>(records);
    });
  }

  /**
   * Find a record by its primary key
   * @param id - Primary key value
   * @param options - Query options
   * @returns Promise that resolves to model instance or null if not found
   */
  public static async find<T extends Model>(
    id: string | number,
    options?: QueryOptions
  ): Promise<T | null> {
    const modelClass = this as unknown as typeof Model;
    const primaryKeys = modelClass.getPrimaryKeys();

    if (primaryKeys.length === 0) {
      throw new Error(`No primary key defined for model ${modelClass.name}`);
    }

    // Use the first primary key if there are multiple
    const primaryKey = primaryKeys[0];

    return this.connectionProvider.execute(async (connection) => {
      const qb = new QueryBuilder(connection, modelClass.getTableName());
      const record = await qb.where(primaryKey, "=", id).first(options);

      if (!record) {
        return null;
      }

      return modelClass.hydrate<T>([record])[0];
    });
  }

  /**
   * Find a record by some conditions or throw an error if not found
   * @param id - Primary key value
   * @param options - Query options
   * @returns Promise that resolves to model instance
   * @throws Error if record not found
   */
  public static async findOrFail<T extends Model>(
    id: string | number,
    options?: QueryOptions
  ): Promise<T> {
    const modelClass = this as unknown as typeof Model;
    const model = await modelClass.find<T>(id, options);

    if (!model) {
      throw new Error(
        `Record with id ${id} not found in table ${modelClass.getTableName()}`
      );
    }

    return model;
  }

  /**
   * Find first record matching the conditions
   * @param conditions - Conditions to match
   * @param options - Query options
   * @returns Promise that resolves to model instance or null if not found
   */
  public static async findBy<T extends Model>(
    conditions: Record<string, any>,
    options?: QueryOptions
  ): Promise<T | null> {
    const modelClass = this as unknown as typeof Model;
    const record = await modelClass.query().where(conditions).first(options);

    if (!record) {
      return null;
    }

    return modelClass.hydrate<T>([record])[0];
  }

  /**
   * Create a new model instance with the given attributes
   * @param attributes - Attributes to set on the model
   * @returns Model instance
   */
  public static create<T extends Model>(attributes: Record<string, any>): T {
    const modelClass = this as any;
    const model = new modelClass();

    // Set attributes on the model
    Object.entries(attributes).forEach(([key, value]) => {
      (model as any)[key] = value;
    });

    return model as T;
  }

  /**
   * Create a new model instance with the given attributes and save it to the database
   * @param attributes - Attributes to set on the model
   * @param options - Query options
   * @returns Promise that resolves to model instance
   */
  public static async createAndSave<T extends Model>(
    attributes: Record<string, any>,
    options?: QueryOptions
  ): Promise<T> {
    const modelClass = this as unknown as typeof Model;
    const model = modelClass.create<T>(attributes);
    await model.save(options);
    return model;
  }

  /**
   * Convert raw database records to model instances
   * @param records - Raw database records
   * @returns Array of model instances
   */
  protected static hydrate<T extends Model>(
    records: Record<string, any>[]
  ): T[] {
    const modelClass = this as any;

    return records.map((record) => {
      const model = new modelClass();

      // Set attributes on the model
      Object.entries(record).forEach(([key, value]) => {
        // Convert snake_case database keys to camelCase for model
        const propertyKey = snakeToCamel(key);
        (model as any)[propertyKey] = value;
      });

      return model as T;
    });
  }

  /**
   * Count records in the table
   * @param options - Query options
   * @returns Promise that resolves to record count
   */
  public static async count(options?: QueryOptions): Promise<number> {
    return this.query().count(options);
  }

  /**
   * Get the maximum value of a column
   * @param column - Column name
   * @param options - Query options
   * @returns Promise that resolves to maximum value
   */
  public static async max<T = any>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.query().max<T>(column, options);
  }

  /**
   * Get the minimum value of a column
   * @param column - Column name
   * @param options - Query options
   * @returns Promise that resolves to minimum value
   */
  public static async min<T = any>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.query().min<T>(column, options);
  }

  /**
   * Get the sum of values in a column
   * @param column - Column name
   * @param options - Query options
   * @returns Promise that resolves to sum of values
   */
  public static async sum<T = number>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.query().sum<T>(column, options);
  }

  /**
   * Get the average of values in a column
   * @param column - Column name
   * @param options - Query options
   * @returns Promise that resolves to average of values
   */
  public static async avg<T = number>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.query().avg<T>(column, options);
  }

  /**
   * Insert records into the table
   * @param data - Data to insert (single record or array of records)
   * @param options - Query options
   * @returns Promise that resolves to query result
   */
  public static async insert(
    data: Record<string, any> | Record<string, any>[],
    options?: QueryOptions
  ): Promise<QueryResult> {
    return this.query().insert(data, options);
  }

  /**
   * Convert the model instance to a database record
   * @returns Record with column names and values
   */
  public toRecord(): Record<string, any> {
    const constructor = this.constructor as typeof Model;
    const columns = constructor.getColumns();
    const record: Record<string, any> = {};

    // Add values for each column
    columns.forEach((metadata, propertyName) => {
      const value = (this as any)[propertyName];

      // Use database column name
      record[metadata.name] = value;
    });

    return record;
  }

  /**
   * Save the model to the database
   * @param options - Query options
   * @returns Promise that resolves to query result
   */
  public async save(options?: QueryOptions): Promise<QueryResult> {
    const constructor = this.constructor as typeof Model;
    const record = this.toRecord();

    return constructor.connectionProvider.execute(async (connection) => {
      const qb = new QueryBuilder(connection, constructor.getTableName());
      return qb.insert(record, options);
    });
  }

  /**
   * Delete records by condition
   * @param conditions - Conditions to match for deletion
   * @param options - Query options
   * @returns Promise that resolves to query result
   */
  public static async deleteWhere(
    conditions: Record<string, any>,
    options?: QueryOptions
  ): Promise<QueryResult> {
    return this.query().where(conditions).delete(options);
  }

  /**
   * Delete a record by its primary key
   * @param id - Primary key value
   * @param options - Query options
   * @returns Promise that resolves to query result
   */
  public static async deleteById(
    id: string | number,
    options?: QueryOptions
  ): Promise<QueryResult> {
    const primaryKeys = this.getPrimaryKeys();

    if (primaryKeys.length === 0) {
      throw new Error(`No primary key defined for model ${this.name}`);
    }

    // Use the first primary key if there are multiple
    const primaryKey = primaryKeys[0];

    return this.query().where(primaryKey, "=", id).delete(options);
  }

  /**
   * Delete the current model instance from the database
   * @param options - Query options
   * @returns Promise that resolves to query result
   */
  public async delete(options?: QueryOptions): Promise<QueryResult> {
    const modelClass = this.constructor as typeof Model;
    const primaryKeys = modelClass.getPrimaryKeys();

    if (primaryKeys.length === 0) {
      throw new Error(
        `Cannot delete model instance: No primary key defined for model ${modelClass.name}`
      );
    }

    return modelClass.connectionProvider.execute(async (connection) => {
      // Build query using all available primary keys
      const qb = new QueryBuilder(connection, modelClass.getTableName());

      for (const key of primaryKeys) {
        const value = (this as any)[key];

        if (value === undefined) {
          throw new Error(
            `Cannot delete model instance: Primary key '${key}' is undefined`
          );
        }

        qb.where(key, "=", value);
      }

      return qb.delete(options);
    });
  }
}
