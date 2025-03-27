import { DataTypes, TableEngines } from "../constants/Types";

/**
 * Column definition for table schema
 */
export interface ColumnDefinition {
  /**
   * Column name
   */
  name: string;

  /**
   * Column data type
   */
  type: string;

  /**
   * Nullable flag
   */
  nullable?: boolean;

  /**
   * Default value expression
   */
  default?: string;

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
 * ColumnBuilder class for fluent column definition
 */
export class ColumnBuilder {
  /**
   * Column definition
   */
  private column: ColumnDefinition;

  /**
   * Reference to the Blueprint instance
   */
  private blueprint: Blueprint;

  /**
   * Flag to track if the column was registered
   */
  private registered: boolean = false;

  /**
   * Create a new ColumnBuilder instance
   * @param name - Column name
   * @param type - Column type
   * @param blueprint - Reference to the Blueprint instance
   */
  constructor(name: string, type: string, blueprint: Blueprint) {
    this.column = {
      name,
      type,
    };

    this.blueprint = blueprint;

    // Register the column automatically when created
    // This ensures columns are registered even if no chained methods are called
    this.blueprint.registerColumn(this.column);
    this.registered = true;
  }

  /**
   * Register the column with the blueprint if not already registered
   * Used internally to ensure column is registered when methods are called
   */
  private ensureRegistered(): void {
    if (!this.registered) {
      this.blueprint.registerColumn(this.column);
      this.registered = true;
    }
  }

  /**
   * Set column name
   * @param name - Column name
   * @returns ColumnBuilder instance for chaining
   */
  public name(name: string): this {
    this.column.name = name;
    return this;
  }

  /**
   * Make column nullable
   * @param isNullable - Optional flag to set nullable status (defaults to true)
   * @returns ColumnBuilder instance for chaining
   */
  public nullable(isNullable: boolean = true): this {
    this.column.nullable = isNullable;
    return this;
  }

  /**
   * Set default value for column
   * @param expression - Default value expression
   * @returns ColumnBuilder instance for chaining
   */
  public default(expression: string): this {
    this.column.default = expression;
    return this;
  }

  /**
   * Set comment for column
   * @param text - Comment text
   * @returns ColumnBuilder instance for chaining
   */
  public comment(text: string): this {
    this.column.comment = text;
    return this;
  }

  /**
   * Set codec for column compression
   * @param codecExpression - Codec expression
   * @returns ColumnBuilder instance for chaining
   */
  public codec(codecExpression: string): this {
    this.column.codec = codecExpression;
    return this;
  }

  /**
   * Set TTL expression for column
   * @param expression - TTL expression
   * @returns ColumnBuilder instance for chaining
   */
  public ttl(expression: string): this {
    this.column.ttl = expression;
    return this;
  }

  /**
   * Get the column definition
   * @returns Column definition
   */
  public getDefinition(): ColumnDefinition {
    return this.column;
  }

  /**
   * Register the column with the blueprint and return the blueprint
   * for continuing the chain on the blueprint
   * @returns Blueprint instance
   * @deprecated No longer needed as registration happens automatically
   */
  public register(): Blueprint {
    return this.blueprint;
  }

  // Proxy methods from Blueprint to allow direct chaining

  /**
   * Proxy for Blueprint.mergeTree()
   */
  public mergeTree(): Blueprint {
    return this.blueprint.mergeTree();
  }

  /**
   * Proxy for Blueprint.orderBy()
   */
  public orderBy(columns: OrderByKey): Blueprint {
    return this.blueprint.orderBy(columns);
  }

  /**
   * Proxy for Blueprint.partitionBy()
   */
  public partitionBy(partitionKey: PartitionKey): Blueprint {
    return this.blueprint.partitionBy(partitionKey);
  }

  /**
   * Proxy for Blueprint.tableSettings()
   */
  public tableSettings(settings: TableSettings): Blueprint {
    return this.blueprint.tableSettings(settings);
  }

  /**
   * Proxy for Blueprint.comment()
   */
  public tableComment(comment: string): Blueprint {
    return this.blueprint.comment(comment);
  }

  /**
   * Proxy for Blueprint.sampleBy()
   */
  public sampleBy(expression: SamplingExpression): Blueprint {
    return this.blueprint.sampleBy(expression);
  }

  /**
   * Proxy for Blueprint.ttl() (table-level TTL)
   */
  public tableTtl(expression: TTLExpression): Blueprint {
    return this.blueprint.ttl(expression);
  }

  /**
   * Proxy for Blueprint.replacingMergeTree()
   */
  public replacingMergeTree(version?: string): Blueprint {
    return this.blueprint.replacingMergeTree(version);
  }

  /**
   * Proxy for Blueprint.summingMergeTree()
   */
  public summingMergeTree(...columns: string[]): Blueprint {
    return this.blueprint.summingMergeTree(...columns);
  }

  /**
   * Proxy for Blueprint.aggregatingMergeTree()
   */
  public aggregatingMergeTree(): Blueprint {
    return this.blueprint.aggregatingMergeTree();
  }

  /**
   * Proxy for Blueprint.collapsingMergeTree()
   */
  public collapsingMergeTree(signColumn: string): Blueprint {
    return this.blueprint.collapsingMergeTree(signColumn);
  }

  /**
   * Proxy for Blueprint.versionedCollapsingMergeTree()
   */
  public versionedCollapsingMergeTree(
    signColumn: string,
    versionColumn: string
  ): Blueprint {
    return this.blueprint.versionedCollapsingMergeTree(
      signColumn,
      versionColumn
    );
  }

  /**
   * Proxy for Blueprint.dropColumn()
   */
  public dropColumn(name: string): Blueprint {
    return this.blueprint.dropColumn(name);
  }
}

/**
 * Index definition for table schema
 */
export interface IndexDefinition {
  /**
   * Index name
   */
  name: string;

  /**
   * Column or expression to index
   */
  expression: string;

  /**
   * Index type
   */
  type?: "minmax" | "set" | "ngrambf_v1" | "tokenbf_v1" | "bloom_filter";

  /**
   * Granularity for the index
   */
  granularity?: number;
}

/**
 * Table settings options
 */
export interface TableSettings {
  /**
   * Index granularity (number of rows per index)
   */
  index_granularity?: number;

  /**
   * Size of granule in rows (default: 8192)
   */
  index_granularity_bytes?: number;

  /**
   * Merging options
   */
  enable_mixed_granularity_parts?: boolean;
  min_merge_bytes_to_use_direct_io?: number;
  merge_with_ttl_timeout?: number;
  write_final_mark?: boolean;

  /**
   * Storage policy name
   */
  storage_policy?: string;

  /**
   * Any other custom settings
   */
  [key: string]: any;
}

/**
 * Partition key definition
 */
export type PartitionKey = string | string[];

/**
 * Order by definition (PRIMARY KEY)
 */
export type OrderByKey = string | string[];

/**
 * Sampling expression
 */
export type SamplingExpression = string;

/**
 * TTL expression
 */
export type TTLExpression = string;

/**
 * Blueprint class for defining table schema
 * Used in migrations to define table structure in a fluent manner
 */
export class Blueprint {
  /**
   * Table name
   */
  private readonly table: string;

  /**
   * Collection of column definitions
   */
  private columns: ColumnDefinition[] = [];

  /**
   * Collection of index definitions
   */
  private indices: IndexDefinition[] = [];

  /**
   * Table engine to use
   */
  private engine: TableEngines = TableEngines.MERGE_TREE;

  /**
   * Engine parameters
   */
  private engineParams: string[] = [];

  /**
   * Order by expressions (PRIMARY KEY)
   */
  private orderByExpressions: string[] = [];

  /**
   * Partition by expression
   */
  private partitionByExpression: string | null = null;

  /**
   * Sampling expression
   */
  private samplingExpression: string | null = null;

  /**
   * Table TTL expression
   */
  private ttlExpression: string | null = null;

  /**
   * Table settings
   */
  private settings: TableSettings = {};

  /**
   * Comment for the table
   */
  private tableComment: string | null = null;

  /**
   * Flag for if table is temporary
   */
  private isTemporary: boolean = false;

  /**
   * Flag for if table should be created if it doesn't exist
   */
  private ifNotExists: boolean = true;

  /**
   * Track column modifications for ALTER TABLE
   */
  private columnModifications: {
    add: ColumnDefinition[];
    modify: ColumnDefinition[];
    drop: string[];
  } = {
    add: [],
    modify: [],
    drop: [],
  };

  /**
   * Flag to indicate if we're in an ALTER TABLE context
   */
  private isAltering: boolean = false;

  /**
   * Create a new Blueprint instance
   * @param table - Table name
   */
  constructor(table: string) {
    this.table = table;
  }

  /**
   * Register a column definition generated by a ColumnBuilder
   * @param column - Column definition to register
   */
  public registerColumn(column: ColumnDefinition): void {
    // If we're in an ALTER TABLE context, track the addition
    if (this.isAltering) {
      this.columnModifications.add.push(column);
    } else {
      this.columns.push(column);
    }
  }

  /**
   * Private method to create a ColumnBuilder for fluent API
   * @param name - Column name
   * @param type - Column type
   * @param options - Column options (for compatibility with existing code)
   * @returns ColumnBuilder instance
   */
  private createColumn(
    name: string,
    type: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    const builder = new ColumnBuilder(name, type, this);

    // Apply any options passed (for backward compatibility)
    if (options.nullable !== undefined) builder.nullable(options.nullable);
    if (options.default !== undefined) builder.default(options.default);
    if (options.comment !== undefined) builder.comment(options.comment);
    if (options.codec !== undefined) builder.codec(options.codec);
    if (options.ttl !== undefined) builder.ttl(options.ttl);

    return builder;
  }

  /**
   * Add a String column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public string(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.STRING, options);
  }

  /**
   * Add an Int32 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public int32(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.INT32, options);
  }

  /**
   * Add an Int8 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public int8(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.INT8, options);
  }

  /**
   * Add an UInt8 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public uint8(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.UINT8, options);
  }

  /**
   * Add an Int16 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public int16(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.INT16, options);
  }

  /**
   * Add an UInt16 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public uint16(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.UINT16, options);
  }

  /**
   * Add an UInt32 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public uint32(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.UINT32, options);
  }

  /**
   * Add an Int64 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public int64(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.INT64, options);
  }

  /**
   * Add an UInt64 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public uint64(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.UINT64, options);
  }

  /**
   * Add a Float32 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public float32(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.FLOAT32, options);
  }

  /**
   * Add a Float64 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public float64(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.FLOAT64, options);
  }

  /**
   * Add a Decimal column
   * @param name - Column name
   * @param precision - Precision (total digits)
   * @param scale - Scale (decimal places)
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public decimal(
    name: string,
    precision: number = 10,
    scale: number = 0,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(
      name,
      `${DataTypes.DECIMAL}(${precision}, ${scale})`,
      options
    );
  }

  /**
   * Add a FixedString column
   * @param name - Column name
   * @param length - String length
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public fixedString(
    name: string,
    length: number,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(
      name,
      `${DataTypes.FIXED_STRING}(${length})`,
      options
    );
  }

  /**
   * Add a UUID column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public uuid(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.UUID, options);
  }

  /**
   * Add a Date column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public date(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.DATE, options);
  }

  /**
   * Add a Date32 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public date32(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.DATE32, options);
  }

  /**
   * Add a DateTime column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public dateTime(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.DATETIME, options);
  }

  /**
   * Add a DateTime64 column
   * @param name - Column name
   * @param precision - Precision (0-9)
   * @param timezone - Timezone name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public dateTime64(
    name: string,
    precision: number = 3,
    timezone?: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    let type = `${DataTypes.DATETIME64}(${precision}`;

    if (timezone) {
      type += `, '${timezone}'`;
    }

    type += ")";

    return this.createColumn(name, type, options);
  }

  /**
   * Add a Boolean column (implemented as UInt8)
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public boolean(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.BOOLEAN, options);
  }

  /**
   * Add an Array column
   * @param name - Column name
   * @param subtype - Array element type
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public array(
    name: string,
    subtype: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, `${DataTypes.ARRAY}(${subtype})`, options);
  }

  /**
   * Add a Nullable column
   * @param name - Column name
   * @param subtype - Base type
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public nullable(
    name: string,
    subtype: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type" | "nullable">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, `${DataTypes.NULLABLE}(${subtype})`, {
      ...options,
      nullable: true,
    });
  }

  /**
   * Add a LowCardinality column
   * @param name - Column name
   * @param subtype - Base type
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public lowCardinality(
    name: string,
    subtype: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(
      name,
      `${DataTypes.LOW_CARDINALITY}(${subtype})`,
      options
    );
  }

  /**
   * Add a Map column
   * @param name - Column name
   * @param keyType - Key type
   * @param valueType - Value type
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public map(
    name: string,
    keyType: string,
    valueType: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(
      name,
      `${DataTypes.MAP}(${keyType}, ${valueType})`,
      options
    );
  }

  /**
   * Add an IPv4 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public ipv4(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.IPV4, options);
  }

  /**
   * Add an IPv6 column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public ipv6(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.IPV6, options);
  }

  /**
   * Add a JSON column
   * @param name - Column name
   * @param options - Column options (for backward compatibility)
   * @returns ColumnBuilder instance for chaining
   */
  public json(
    name: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): ColumnBuilder {
    return this.createColumn(name, DataTypes.JSON, options);
  }

  /**
   * Add an index to the table
   * @param name - Index name
   * @param expression - Index expression
   * @param type - Index type
   * @param granularity - Index granularity
   * @returns Blueprint instance for chaining
   */
  public index(
    name: string,
    expression: string,
    type: IndexDefinition["type"] = "minmax",
    granularity: number = 1
  ): this {
    this.indices.push({
      name,
      expression,
      type,
      granularity,
    });

    return this;
  }

  /**
   * Set the engine for the table
   * @param engine - Table engine
   * @param params - Engine parameters
   * @returns Blueprint instance for chaining
   */
  public setEngine(engine: TableEngines, ...params: string[]): this {
    this.engine = engine;
    this.engineParams = params;
    return this;
  }

  /**
   * Set the MergeTree engine
   * @returns Blueprint instance for chaining
   */
  public mergeTree(): this {
    return this.setEngine(TableEngines.MERGE_TREE);
  }

  /**
   * Set the ReplacingMergeTree engine
   * @param version - Version column name (optional)
   * @returns Blueprint instance for chaining
   */
  public replacingMergeTree(version?: string): this {
    return this.setEngine(
      TableEngines.REPLACING_MERGE_TREE,
      ...(version ? [version] : [])
    );
  }

  /**
   * Set the SummingMergeTree engine
   * @param columns - Columns to sum (optional)
   * @returns Blueprint instance for chaining
   */
  public summingMergeTree(...columns: string[]): this {
    return this.setEngine(
      TableEngines.SUMMING_MERGE_TREE,
      ...(columns.length ? [columns.join(", ")] : [])
    );
  }

  /**
   * Set the AggregatingMergeTree engine
   * @returns Blueprint instance for chaining
   */
  public aggregatingMergeTree(): this {
    return this.setEngine(TableEngines.AGGREGATING_MERGE_TREE);
  }

  /**
   * Set the CollapsingMergeTree engine
   * @param signColumn - Sign column name
   * @returns Blueprint instance for chaining
   */
  public collapsingMergeTree(signColumn: string): this {
    return this.setEngine(TableEngines.COLLAPSING_MERGE_TREE, signColumn);
  }

  /**
   * Set the VersionedCollapsingMergeTree engine
   * @param signColumn - Sign column name
   * @param versionColumn - Version column name
   * @returns Blueprint instance for chaining
   */
  public versionedCollapsingMergeTree(
    signColumn: string,
    versionColumn: string
  ): this {
    return this.setEngine(
      TableEngines.VERSIONED_COLLAPSING_MERGE_TREE,
      signColumn,
      versionColumn
    );
  }

  /**
   * Set the order by expression (PRIMARY KEY)
   * @param columns - Column expressions
   * @returns Blueprint instance for chaining
   */
  public orderBy(columns: OrderByKey): this {
    if (Array.isArray(columns)) {
      this.orderByExpressions = columns;
    } else {
      this.orderByExpressions = [columns];
    }

    return this;
  }

  /**
   * Set the partition by expression
   * @param partitionKey - Partition key expression
   * @returns Blueprint instance for chaining
   */
  public partitionBy(partitionKey: PartitionKey): this {
    if (Array.isArray(partitionKey)) {
      this.partitionByExpression = partitionKey.join(", ");
    } else {
      this.partitionByExpression = partitionKey;
    }

    return this;
  }

  /**
   * Set the sampling expression
   * @param expression - Sampling expression
   * @returns Blueprint instance for chaining
   */
  public sampleBy(expression: SamplingExpression): this {
    this.samplingExpression = expression;
    return this;
  }

  /**
   * Set the TTL expression
   * @param expression - TTL expression
   * @returns Blueprint instance for chaining
   */
  public ttl(expression: TTLExpression): this {
    this.ttlExpression = expression;
    return this;
  }

  /**
   * Set table settings
   * @param settings - Table settings
   * @returns Blueprint instance for chaining
   */
  public tableSettings(settings: TableSettings): this {
    this.settings = { ...this.settings, ...settings };
    return this;
  }

  /**
   * Set a comment for the table
   * @param comment - Table comment
   * @returns Blueprint instance for chaining
   */
  public comment(comment: string): this {
    this.tableComment = comment;
    return this;
  }

  /**
   * Mark the table as temporary
   * @returns Blueprint instance for chaining
   */
  public temporary(): this {
    this.isTemporary = true;
    return this;
  }

  /**
   * Set if not exists flag
   * @param value - If not exists flag value
   * @returns Blueprint instance for chaining
   */
  public setIfNotExists(value: boolean): this {
    this.ifNotExists = value;
    return this;
  }

  /**
   * Build the SQL for creating the table
   * @returns SQL query for creating the table
   */
  public toSql(): string {
    // Start the create table statement
    let sql = "CREATE";

    // Add temporary flag if needed
    if (this.isTemporary) {
      sql += " TEMPORARY";
    }

    sql += " TABLE";

    // Add if not exists flag if needed
    if (this.ifNotExists) {
      sql += " IF NOT EXISTS";
    }

    sql += ` ${this.table} (\n`;

    // Add columns
    const columnDefinitions = this.columns
      .map((column) => {
        let def = `    ${column.name} ${column.type}`;

        // Add default expression if provided
        if (column.default) {
          def += ` DEFAULT ${column.default}`;
        }

        // Add comment if provided
        if (column.comment) {
          def += ` COMMENT '${column.comment.replace(/'/g, "''")}'`;
        }

        // Add codec if provided
        if (column.codec) {
          def += ` CODEC(${column.codec})`;
        }

        // Add TTL if provided
        if (column.ttl) {
          def += ` TTL ${column.ttl}`;
        }

        return def;
      })
      .join(",\n");

    sql += columnDefinitions;

    // Add indices if any
    if (this.indices.length > 0) {
      const indexDefinitions = this.indices
        .map((idx) => {
          return `    INDEX ${idx.name} ${idx.expression} TYPE ${idx.type} GRANULARITY ${idx.granularity}`;
        })
        .join(",\n");

      sql += ",\n" + indexDefinitions;
    }

    sql += "\n)";

    // Add engine
    sql += ` ENGINE = ${this.engine}`;

    // Add engine parameters if any
    if (this.engineParams.length > 0) {
      sql += `(${this.engineParams.join(", ")})`;
    }

    // Add ORDER BY clause if provided
    if (this.orderByExpressions.length > 0) {
      sql += `\nORDER BY (${this.orderByExpressions.join(", ")})`;
    }

    // Add PARTITION BY clause if provided
    if (this.partitionByExpression) {
      sql += `\nPARTITION BY ${this.partitionByExpression}`;
    }

    // Add SAMPLE BY clause if provided
    if (this.samplingExpression) {
      sql += `\nSAMPLE BY ${this.samplingExpression}`;
    }

    // Add TTL clause if provided
    if (this.ttlExpression) {
      sql += `\nTTL ${this.ttlExpression}`;
    }

    // Add SETTINGS if provided
    if (Object.keys(this.settings).length > 0) {
      const settingsStrings = Object.entries(this.settings)
        .map(([key, value]) => {
          return `${key} = ${value}`;
        })
        .join(", ");

      sql += `\nSETTINGS ${settingsStrings}`;
    }

    // Add comment if provided
    if (this.tableComment) {
      sql += `\nCOMMENT '${this.tableComment.replace(/'/g, "''")}'`;
    }

    sql += ";";

    return sql;
  }

  /**
   * Build the SQL for dropping the table
   * @param ifExists - Add IF EXISTS clause
   * @returns SQL query for dropping the table
   */
  public toDropSql(ifExists: boolean = true): string {
    let sql = "DROP TABLE";

    if (ifExists) {
      sql += " IF EXISTS";
    }

    sql += ` ${this.table};`;

    return sql;
  }

  /**
   * Get the table name
   * @returns Table name
   */
  public getTableName(): string {
    return this.table;
  }

  /**
   * Get columns
   * @returns Column definitions
   */
  public getColumns(): ColumnDefinition[] {
    return [...this.columns];
  }

  /**
   * Generate SQL for ALTER TABLE operations
   * @returns SQL string for ALTER TABLE
   */
  public toAlterSql(): string {
    const parts: string[] = [];
    const tableName = this.getTableName();

    // Add columns
    for (const column of this.columnModifications.add) {
      parts.push(`ADD COLUMN ${this.formatColumnDefinition(column)}`);
    }

    // Modify columns
    for (const column of this.columnModifications.modify) {
      parts.push(`MODIFY COLUMN ${this.formatColumnDefinition(column)}`);
    }

    // Drop columns
    for (const column of this.columnModifications.drop) {
      parts.push(`DROP COLUMN ${column}`);
    }

    if (parts.length === 0) {
      return "";
    }

    return `ALTER TABLE ${tableName} ${parts.join(", ")}`;
  }

  /**
   * Format a column definition for SQL
   * @param column - Column definition
   * @returns Formatted column definition
   */
  private formatColumnDefinition(column: ColumnDefinition): string {
    let definition = `${column.name} ${column.type}`;

    // Only add NULL/NOT NULL constraints when not in ALTER TABLE context
    if (!this.isAltering) {
      if (column.nullable) {
        definition += " NULL";
      } else {
        definition += " NOT NULL";
      }
    }

    if (column.default) {
      definition += ` DEFAULT ${column.default}`;
    }

    if (column.comment) {
      definition += ` COMMENT '${column.comment}'`;
    }

    if (column.codec) {
      definition += ` CODEC(${column.codec})`;
    }

    if (column.ttl) {
      definition += ` TTL ${column.ttl}`;
    }

    return definition;
  }

  /**
   * Drop a column
   * @param name - Column name to drop
   * @returns Blueprint instance for chaining
   */
  public dropColumn(name: string): this {
    this.columnModifications.drop.push(name);
    return this;
  }

  /**
   * Set the ALTER TABLE context
   * @param value - Whether we're in an ALTER TABLE context
   * @returns Blueprint instance for chaining
   */
  public setAltering(value: boolean): this {
    this.isAltering = value;
    return this;
  }

  /**
   * Add a column to the table
   * @param name - Column name
   * @param type - Column type
   * @param options - Column options
   * @returns Blueprint instance for chaining
   * @deprecated Use the fluent interface instead
   */
  private addColumnDefinition(
    name: string,
    type: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): this {
    const column = {
      name,
      type,
      ...options,
    };

    // If we're in an ALTER TABLE context, track the addition
    if (this.isAltering) {
      this.columnModifications.add.push(column);
    } else {
      this.columns.push(column);
    }

    return this;
  }

  /**
   * Modify an existing column
   * @param name - Column name
   * @param type - New column type
   * @param options - New column options
   * @returns Blueprint instance for chaining
   */
  private modifyColumnDefinition(
    name: string,
    type: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): this {
    this.columnModifications.modify.push({
      name,
      type,
      ...options,
    });
    return this;
  }

  /**
   * Base method to handle column definitions for both new and existing columns
   * @param name - Column name
   * @param type - Column type
   * @param options - Column options
   * @returns Blueprint instance for chaining
   * @deprecated Use the fluent interface instead
   */
  private handleColumnDefinition(
    name: string,
    type: string,
    options: Partial<Omit<ColumnDefinition, "name" | "type">> = {}
  ): this {
    if (this.isAltering) {
      // In ALTER TABLE context, we need to determine if this is a new column or modifying existing
      const isModify =
        this.columnModifications.modify.some((col) => col.name === name) ||
        this.columnModifications.add.some((col) => col.name === name);

      if (isModify) {
        return this.modifyColumnDefinition(name, type, options);
      } else {
        return this.addColumnDefinition(name, type, options);
      }
    }
    return this.addColumnDefinition(name, type, options);
  }
}
