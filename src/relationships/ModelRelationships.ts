import { ClickHouseConnection } from "../connection/ClickHouseConnection";
import { MetadataStorage } from "../decorators/ModelDecorators";
import { Model } from "../model/Model";
import { QueryBuilder } from "../query/QueryBuilder";

/**
 * Base class for all relationship types
 * Provides common functionality for relationship management
 */
export abstract class Relationship<T extends Model, R extends Model> {
  /**
   * The model instance that owns this relationship
   */
  protected ownerModel: T;

  /**
   * The related model class
   */
  protected relatedModelClass: new () => R;

  /**
   * Local key on the owner model
   */
  protected localKey: string;

  /**
   * Constructor for relationship
   * @param ownerModel - The model instance that owns this relationship
   * @param relatedModelClass - The related model class
   * @param localKey - The local key (default: primary key of owner model)
   */
  constructor(
    ownerModel: T,
    relatedModelClass: new () => R,
    localKey?: string
  ) {
    this.ownerModel = ownerModel;
    this.relatedModelClass = relatedModelClass;
    this.localKey = localKey || this.getOwnerPrimaryKey();
  }

  /**
   * Get owner model primary key
   */
  protected getOwnerPrimaryKey(): string {
    const primaryKeys = MetadataStorage.getPrimaryKeys(
      this.ownerModel.constructor
    );
    if (primaryKeys.length === 0) {
      throw new Error(
        `No primary key defined for model ${this.ownerModel.constructor.name}`
      );
    }
    return primaryKeys[0];
  }

  /**
   * Get related model primary key
   */
  protected getRelatedPrimaryKey(): string {
    const primaryKeys = MetadataStorage.getPrimaryKeys(this.relatedModelClass);
    if (primaryKeys.length === 0) {
      throw new Error(
        `No primary key defined for model ${this.relatedModelClass.name}`
      );
    }
    return primaryKeys[0];
  }

  /**
   * Get the related model table name
   */
  protected getRelatedTableName(): string {
    const tableName = MetadataStorage.getTableName(this.relatedModelClass);
    if (!tableName) {
      throw new Error(
        `No table name defined for model ${this.relatedModelClass.name}`
      );
    }
    return tableName;
  }

  /**
   * Get the owner model table name
   */
  protected getOwnerTableName(): string {
    const tableName = MetadataStorage.getTableName(this.ownerModel.constructor);
    if (!tableName) {
      throw new Error(
        `No table name defined for model ${this.ownerModel.constructor.name}`
      );
    }
    return tableName;
  }

  /**
   * Get the connection from a model instance
   */
  protected getConnection(): ClickHouseConnection {
    // Using the static getConnection method from Model
    return (this.relatedModelClass as any).getConnection();
  }

  /**
   * Get the query builder for the related model
   */
  protected getQueryBuilder(): QueryBuilder {
    // Use the static method on the Model class instead of an instance method
    return (this.relatedModelClass as any).query();
  }

  /**
   * Abstract method to get related records
   */
  abstract get(): Promise<R[]>;

  /**
   * Abstract method to eager load related records for a collection of models
   */
  abstract eagerLoad(models: T[]): Promise<Map<any, R[]>>;
}

/**
 * HasOne relationship
 * Represents a one-to-one relationship from the owner model to the related model
 */
export class HasOne<T extends Model, R extends Model> extends Relationship<
  T,
  R
> {
  /**
   * Foreign key on the related model
   */
  private foreignKey: string;

  /**
   * Constructor for HasOne relationship
   * @param ownerModel - The model instance that owns this relationship
   * @param relatedModelClass - The related model class
   * @param foreignKey - The foreign key on the related model
   * @param localKey - The local key (default: primary key of owner model)
   */
  constructor(
    ownerModel: T,
    relatedModelClass: new () => R,
    foreignKey: string,
    localKey?: string
  ) {
    super(ownerModel, relatedModelClass, localKey);
    this.foreignKey = foreignKey;
  }

  /**
   * Get the related record
   */
  public async get(): Promise<R[]> {
    const localKeyValue = this.ownerModel[this.localKey as keyof T];

    return this.getQueryBuilder()
      .where(this.foreignKey, "=", localKeyValue)
      .limit(1)
      .get();
  }

  /**
   * Get the first related record (convenience method)
   */
  public async first(): Promise<R | null> {
    const results = await this.get();
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Eager load related records for a collection of models
   */
  public async eagerLoad(models: T[]): Promise<Map<any, R[]>> {
    // Extract the local key values from all models
    const localKeyValues = models.map(
      (model) => model[this.localKey as keyof T]
    );

    // Query the related records
    const relatedRecords = await this.getQueryBuilder()
      .whereIn(this.foreignKey, localKeyValues as any[])
      .get();

    // Group related records by the foreign key value
    const recordMap = new Map<any, R[]>();

    for (const record of relatedRecords) {
      const foreignKeyValue = record[this.foreignKey as keyof R];

      if (!recordMap.has(foreignKeyValue)) {
        recordMap.set(foreignKeyValue, []);
      }

      recordMap.get(foreignKeyValue)!.push(record);
    }

    return recordMap;
  }
}

/**
 * HasMany relationship
 * Represents a one-to-many relationship from the owner model to the related model
 */
export class HasMany<T extends Model, R extends Model> extends Relationship<
  T,
  R
> {
  /**
   * Foreign key on the related model
   */
  private foreignKey: string;

  /**
   * Constructor for HasMany relationship
   * @param ownerModel - The model instance that owns this relationship
   * @param relatedModelClass - The related model class
   * @param foreignKey - The foreign key on the related model
   * @param localKey - The local key (default: primary key of owner model)
   */
  constructor(
    ownerModel: T,
    relatedModelClass: new () => R,
    foreignKey: string,
    localKey?: string
  ) {
    super(ownerModel, relatedModelClass, localKey);
    this.foreignKey = foreignKey;
  }

  /**
   * Get the related records
   */
  public async get(): Promise<R[]> {
    const localKeyValue = this.ownerModel[this.localKey as keyof T];

    return this.getQueryBuilder()
      .where(this.foreignKey, "=", localKeyValue)
      .get();
  }

  /**
   * Eager load related records for a collection of models
   */
  public async eagerLoad(models: T[]): Promise<Map<any, R[]>> {
    // Extract the local key values from all models
    const localKeyValues = models.map(
      (model) => model[this.localKey as keyof T]
    );

    // Query the related records
    const relatedRecords = await this.getQueryBuilder()
      .whereIn(this.foreignKey, localKeyValues as any[])
      .get();

    // Group related records by the foreign key value
    const recordMap = new Map<any, R[]>();

    for (const record of relatedRecords) {
      const foreignKeyValue = record[this.foreignKey as keyof R];

      if (!recordMap.has(foreignKeyValue)) {
        recordMap.set(foreignKeyValue, []);
      }

      recordMap.get(foreignKeyValue)!.push(record);
    }

    return recordMap;
  }
}

/**
 * BelongsTo relationship
 * Represents an inverse one-to-one or one-to-many relationship
 */
export class BelongsTo<T extends Model, R extends Model> extends Relationship<
  T,
  R
> {
  /**
   * Foreign key on the owner model
   */
  private foreignKey: string;

  /**
   * Constructor for BelongsTo relationship
   * @param ownerModel - The model instance that owns this relationship
   * @param relatedModelClass - The related model class
   * @param foreignKey - The foreign key on the owner model
   * @param ownerKey - The referenced key on the related model (default: primary key)
   */
  constructor(
    ownerModel: T,
    relatedModelClass: new () => R,
    foreignKey: string,
    ownerKey?: string
  ) {
    super(ownerModel, relatedModelClass, ownerKey || (null as any));
    this.foreignKey = foreignKey;

    // If no owner key is provided, use the primary key of the related model
    if (!ownerKey) {
      this.localKey = this.getRelatedPrimaryKey();
    }
  }

  /**
   * Get the related record
   */
  public async get(): Promise<R[]> {
    const foreignKeyValue = this.ownerModel[this.foreignKey as keyof T];

    return this.getQueryBuilder()
      .where(this.localKey, "=", foreignKeyValue)
      .limit(1)
      .get();
  }

  /**
   * Get the first related record (convenience method)
   */
  public async first(): Promise<R | null> {
    const results = await this.get();
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Eager load related records for a collection of models
   */
  public async eagerLoad(models: T[]): Promise<Map<any, R[]>> {
    // Extract the foreign key values from all models
    const foreignKeyValues = models.map(
      (model) => model[this.foreignKey as keyof T]
    );

    // Query the related records
    const relatedRecords = await this.getQueryBuilder()
      .whereIn(this.localKey, foreignKeyValues as any[])
      .get();

    // Group related records by the owner key value
    const recordMap = new Map<any, R[]>();

    for (const record of relatedRecords) {
      const ownerKeyValue = record[this.localKey as keyof R];

      if (!recordMap.has(ownerKeyValue)) {
        recordMap.set(ownerKeyValue, []);
      }

      recordMap.get(ownerKeyValue)!.push(record);
    }

    return recordMap;
  }
}

/**
 * ManyToMany relationship
 * Represents a many-to-many relationship through a pivot table
 */
export class ManyToMany<T extends Model, R extends Model> extends Relationship<
  T,
  R
> {
  /**
   * Pivot table name
   */
  private pivotTable: string;

  /**
   * Foreign key on the pivot table for the owner model
   */
  private foreignPivotKey: string;

  /**
   * Foreign key on the pivot table for the related model
   */
  private relatedPivotKey: string;

  /**
   * Constructor for ManyToMany relationship
   * @param ownerModel - The model instance that owns this relationship
   * @param relatedModelClass - The related model class
   * @param pivotTable - The pivot table name
   * @param foreignPivotKey - The foreign key on the pivot table for the owner model
   * @param relatedPivotKey - The foreign key on the pivot table for the related model
   * @param localKey - The local key on the owner model (default: primary key)
   * @param relatedKey - The local key on the related model (default: primary key)
   */
  constructor(
    ownerModel: T,
    relatedModelClass: new () => R,
    pivotTable: string,
    foreignPivotKey: string,
    relatedPivotKey: string,
    localKey?: string,
    private relatedKey?: string
  ) {
    super(ownerModel, relatedModelClass, localKey);
    this.pivotTable = pivotTable;
    this.foreignPivotKey = foreignPivotKey;
    this.relatedPivotKey = relatedPivotKey;
    this.relatedKey = relatedKey || this.getRelatedPrimaryKey();
  }

  /**
   * Get the related records
   */
  public async get(): Promise<R[]> {
    const localKeyValue = this.ownerModel[this.localKey as keyof T];
    const relatedTable = this.getRelatedTableName();
    const queryBuilder = this.getQueryBuilder();

    // Create a query builder for the related model and use raw SQL for join
    return queryBuilder.rawQuery(`
        SELECT ${relatedTable}.* 
        FROM ${relatedTable}
        INNER JOIN ${this.pivotTable} ON ${relatedTable}.${this.relatedKey} = ${this.pivotTable}.${this.relatedPivotKey}
        WHERE ${this.pivotTable}.${this.foreignPivotKey} = '${localKeyValue}'
      `);
  }

  /**
   * Eager load related records for a collection of models
   */
  public async eagerLoad(models: T[]): Promise<Map<any, R[]>> {
    // Extract the local key values from all models
    const localKeyValues = models.map(
      (model) => model[this.localKey as keyof T]
    );

    const relatedTable = this.getRelatedTableName();
    const localKeyValuesString = localKeyValues.map((v) => `'${v}'`).join(",");

    // Query using raw SQL for the join
    const queryBuilder = this.getQueryBuilder();
    const relatedRecords = await queryBuilder.rawQuery(`
      SELECT ${relatedTable}.*, ${this.pivotTable}.${this.foreignPivotKey} as pivot_foreign_key
      FROM ${relatedTable}
      INNER JOIN ${this.pivotTable} ON ${relatedTable}.${this.relatedKey} = ${this.pivotTable}.${this.relatedPivotKey}
      WHERE ${this.pivotTable}.${this.foreignPivotKey} IN (${localKeyValuesString})
    `);

    // Group related records by the pivot foreign key value
    const recordMap = new Map<any, R[]>();

    for (const record of relatedRecords) {
      // Get the pivot foreign key from the record
      const foreignKeyValue = (record as any).pivot_foreign_key;

      if (!recordMap.has(foreignKeyValue)) {
        recordMap.set(foreignKeyValue, []);
      }

      recordMap.get(foreignKeyValue)!.push(record);
    }

    return recordMap;
  }

  /**
   * Attach related models to the owner model
   * @param relatedIds - IDs of related models to attach
   */
  public async attach(relatedIds: any | any[]): Promise<void> {
    const ids = Array.isArray(relatedIds) ? relatedIds : [relatedIds];
    const localKeyValue = this.ownerModel[this.localKey as keyof T];

    // Prepare the pivot data for insertion
    const pivotData = ids.map((id) => ({
      [this.foreignPivotKey]: localKeyValue,
      [this.relatedPivotKey]: id,
    }));

    // Get the connection
    const connection = this.getConnection();

    // Insert into the pivot table
    await connection.insert(this.pivotTable, pivotData);
  }

  /**
   * Detach related models from the owner model
   * @param relatedIds - Optional IDs of related models to detach. Detaches all if not provided.
   */
  public async detach(relatedIds?: any | any[]): Promise<void> {
    const localKeyValue = this.ownerModel[this.localKey as keyof T];

    // Get the connection
    const connection = this.getConnection();

    // Build the query to delete from the pivot table
    let query = `DELETE FROM ${this.pivotTable} WHERE ${this.foreignPivotKey} = '${localKeyValue}'`;

    // If specific IDs are provided, add them to the query
    if (relatedIds !== undefined) {
      const ids = Array.isArray(relatedIds) ? relatedIds : [relatedIds];
      const idsString = ids.map((id) => `'${id}'`).join(", ");
      query += ` AND ${this.relatedPivotKey} IN (${idsString})`;
    }

    // Execute the delete query
    await connection.query(query);
  }

  /**
   * Toggle the attachment status of the given related models
   * @param relatedIds - IDs of related models to toggle
   */
  public async toggle(relatedIds: any | any[]): Promise<void> {
    const ids = Array.isArray(relatedIds) ? relatedIds : [relatedIds];
    const localKeyValue = this.ownerModel[this.localKey as keyof T];

    // Get the connection
    const connection = this.getConnection();

    // Get existing attached IDs
    const query = `SELECT ${this.relatedPivotKey} FROM ${this.pivotTable} WHERE ${this.foreignPivotKey} = '${localKeyValue}'`;
    const result = await connection.query(query);
    const existingIds = result.data.map(
      (row: any) => row[this.relatedPivotKey]
    );

    // Determine which IDs to attach and which to detach
    const idsToAttach = ids.filter((id) => !existingIds.includes(id));
    const idsToDetach = ids.filter((id) => existingIds.includes(id));

    // Attach and detach as needed
    if (idsToAttach.length > 0) {
      await this.attach(idsToAttach);
    }

    if (idsToDetach.length > 0) {
      await this.detach(idsToDetach);
    }
  }
}

/**
 * Relationship decorator options
 */
export interface RelationshipOptions {
  /**
   * Make the relationship lazy-loaded
   * @default false
   */
  lazy?: boolean;
}

/**
 * Class decorator to register relationships for a model
 * @param relationships - Map of relationship property names to relationship definitions
 */
export function Relationships(
  relationships: Record<string, (model: any) => Relationship<any, any>>
): ClassDecorator {
  return function (target: any) {
    // Store the original constructor
    const originalConstructor = target;

    // Create a new constructor
    const newConstructor: any = function (...args: any[]) {
      // Call the original constructor
      const instance = new originalConstructor(...args);

      // Define getters for each relationship
      for (const [property, relationshipFactory] of Object.entries(
        relationships
      )) {
        Object.defineProperty(instance, property, {
          get: function () {
            // Create the relationship instance
            const relationship = relationshipFactory(instance);

            // Return an object that can be called to execute the relationship query
            const relationshipProxy = new Proxy(relationship, {
              // When the property is called as a function, execute the relationship query
              apply: function (target, thisArg, args) {
                return relationship.get();
              },
              // Support property access on the relationship instance
              get: function (target, prop) {
                return target[prop as keyof typeof target];
              },
            });

            return relationshipProxy;
          },
          enumerable: true,
          configurable: true,
        });
      }

      return instance;
    };

    // Copy prototype so intanceof works correctly
    newConstructor.prototype = originalConstructor.prototype;

    // Copy static properties
    Object.setPrototypeOf(newConstructor, originalConstructor);

    // Return the new constructor
    return newConstructor;
  };
}
