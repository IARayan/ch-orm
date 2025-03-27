import { DataTypes } from "../constants/Types";

// Legacy and modern decorator context types
type FieldDecoratorContext<T extends Object, V> = {
  name: string | symbol;
  static: boolean;
  private: boolean;
  access: {
    get?(obj: T): V;
    set?(obj: T, value: V): void;
  };
  metadata?: any;
  addInitializer?(initializer: () => void): void;
};

/**
 * Storage for metadata about models and their columns
 */
export const MetadataStorage = {
  /**
   * Map of model constructors to table names
   */
  tables: new Map<Function, string>(),

  /**
   * Map of model constructors to primary key column names
   */
  primaryKeys: new Map<Function, string[]>(),

  /**
   * Map of model constructors to column definitions
   */
  columns: new Map<Function, Map<string, ColumnMetadata>>(),

  /**
   * Get table name for a model
   * @param target - Model constructor
   * @returns Table name or undefined if not set
   */
  getTableName(target: Function): string | undefined {
    return this.tables.get(target);
  },

  /**
   * Set table name for a model
   * @param target - Model constructor
   * @param name - Table name
   */
  setTableName(target: Function, name: string): void {
    this.tables.set(target, name);
  },

  /**
   * Get primary keys for a model
   * @param target - Model constructor
   * @returns Array of primary key column names
   */
  getPrimaryKeys(target: Function): string[] {
    return this.primaryKeys.get(target) || [];
  },

  /**
   * Add a primary key to a model
   * @param target - Model constructor
   * @param propertyName - Primary key property name
   */
  addPrimaryKey(target: Function, propertyName: string): void {
    const keys = this.primaryKeys.get(target) || [];
    keys.push(propertyName);
    this.primaryKeys.set(target, keys);
  },

  /**
   * Get column metadata for a model
   * @param target - Model constructor
   * @returns Map of property names to column metadata
   */
  getColumns(target: Function): Map<string, ColumnMetadata> {
    if (!this.columns.has(target)) {
      this.columns.set(target, new Map());
    }

    return this.columns.get(target)!;
  },

  /**
   * Add column metadata to a model
   * @param target - Model constructor
   * @param propertyName - Property name
   * @param metadata - Column metadata
   */
  addColumn(
    target: Function,
    propertyName: string,
    metadata: ColumnMetadata
  ): void {
    const columns = this.getColumns(target);
    columns.set(propertyName, metadata);
  },
};

/**
 * Interface for column metadata
 */
export interface ColumnMetadata {
  /**
   * Property name in the model
   */
  propertyName: string;

  /**
   * Column name in the database
   */
  name: string;

  /**
   * Column data type
   */
  type: string;

  /**
   * Whether the column is primary key
   */
  primary?: boolean;

  /**
   * Whether the column is nullable
   */
  nullable?: boolean;

  /**
   * Default value expression
   */
  defaultExpression?: string;

  /**
   * Comment for the column
   */
  comment?: string;

  /**
   * Codec to use for column compression
   */
  codec?: string;

  /**
   * TTL expression for the column
   */
  ttl?: string;
}

/**
 * Column decorator options
 */
export interface ColumnOptions {
  /**
   * Column name in the database (defaults to property name)
   */
  name?: string;

  /**
   * Column data type
   */
  type: string | DataTypes;

  /**
   * Whether the column is primary key
   */
  primary?: boolean;

  /**
   * Whether the column is nullable
   */
  nullable?: boolean;

  /**
   * Default value expression
   */
  defaultExpression?: string;

  /**
   * Comment for the column
   */
  comment?: string;

  /**
   * Codec to use for column compression
   */
  codec?: string;

  /**
   * TTL expression for the column
   */
  ttl?: string;
}

/**
 * Table decorator
 * @param name - Table name
 * @returns Class decorator
 */
export function Table(name: string): ClassDecorator {
  return function (target: Function) {
    MetadataStorage.setTableName(target, name);
    return target as any;
  };
}

/**
 * Column decorator factory
 * @param options - Column options
 * @returns Property decorator
 */
export function Column(options: ColumnOptions): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const constructor = target.constructor;
    const propertyName = propertyKey.toString();

    MetadataStorage.addColumn(constructor, propertyName, {
      propertyName,
      name: options.name || propertyName,
      type: options.type.toString(),
      primary: options.primary,
      nullable: options.nullable,
      defaultExpression: options.defaultExpression,
      comment: options.comment,
      codec: options.codec,
      ttl: options.ttl,
    });

    // If the column is a primary key, add it to the primary keys list
    if (options.primary) {
      MetadataStorage.addPrimaryKey(constructor, propertyName);
    }
  };
}

/**
 * PrimaryKey decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function PrimaryKey(
  options: Partial<Omit<ColumnOptions, "primary">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    primary: true,
    type: options.type || DataTypes.STRING,
  });
}

/**
 * String column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function StringColumn(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.STRING,
  });
}

/**
 * UInt32 column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function UInt32Column(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.UINT32,
  });
}

/**
 * UInt64 column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function UInt64Column(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.UINT64,
  });
}

/**
 * Int32 column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function Int32Column(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.INT32,
  });
}

/**
 * Int64 column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function Int64Column(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.INT64,
  });
}

/**
 * Float32 column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function Float32Column(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.FLOAT32,
  });
}

/**
 * Float64 column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function Float64Column(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.FLOAT64,
  });
}

/**
 * Boolean column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function BooleanColumn(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.BOOLEAN,
  });
}

/**
 * Date column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function DateColumn(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.DATE,
  });
}

/**
 * DateTime column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function DateTimeColumn(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.DATETIME,
  });
}

/**
 * UUID column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function UUIDColumn(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.UUID,
  });
}

/**
 * Array column decorator
 * @param subType - Array element type
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function ArrayColumn(
  subType: string | DataTypes,
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: `${DataTypes.ARRAY}(${subType})`,
  });
}

/**
 * Nullable column decorator
 * @param subType - Base type
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function NullableColumn(
  subType: string | DataTypes,
  options: Partial<Omit<ColumnOptions, "type" | "nullable">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: `${DataTypes.NULLABLE}(${subType})`,
    nullable: true,
  });
}

/**
 * JSON column decorator
 * @param options - Column options (optional)
 * @returns Property decorator
 */
export function JSONColumn(
  options: Partial<Omit<ColumnOptions, "type">> = {}
): PropertyDecorator {
  return Column({
    ...options,
    type: DataTypes.JSON,
  });
}
