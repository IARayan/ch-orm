/**
 * Connection configuration options for ClickHouse database
 */
export interface ConnectionConfig {
  /**
   * ClickHouse server hostname
   * @default 'localhost'
   */
  host: string;

  /**
   * ClickHouse server port
   * @default 8123
   */
  port: number;

  /**
   * Database name to connect to
   * @default 'default'
   */
  database: string;

  /**
   * Username for authentication
   * @default 'default'
   */
  username: string;

  /**
   * Password for authentication
   * @default ''
   */
  password: string;

  /**
   * Protocol to use for connection (http or https)
   * @default 'http'
   */
  protocol?: "http" | "https";

  /**
   * Connection timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Maximum number of connections in the pool
   * @default 10
   */
  maxConnections?: number;

  /**
   * Enable debug mode for logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Result format for query execution
 */
export enum ResultFormat {
  /**
   * JSON format with column names
   */
  JSON = "JSON",

  /**
   * JSON compact format (arrays of values)
   */
  JSONCompact = "JSONCompact",

  /**
   * JSON each row format
   */
  JSONEachRow = "JSONEachRow",

  /**
   * Tab-separated values
   */
  TSV = "TSV",

  /**
   * Tab-separated values with names
   */
  TSVWithNames = "TSVWithNames",

  /**
   * CSV format
   */
  CSV = "CSV",

  /**
   * CSV format with names
   */
  CSVWithNames = "CSVWithNames",
}

/**
 * Interface for query execution options
 */
export interface QueryOptions {
  /**
   * Format for the query result
   * @default ResultFormat.JSON
   */
  format?: ResultFormat;

  /**
   * Session ID for the query
   */
  session_id?: string;

  /**
   * Query timeout in seconds
   */
  timeout_seconds?: number;

  /**
   * Maximum number of rows to return
   */
  max_rows_to_read?: number;

  /**
   * ClickHouse settings for the query
   */
  clickhouse_settings?: Record<string, string | number | boolean>;
}

/**
 * Interface for query execution result
 */
export interface QueryResult<T = any> {
  /**
   * Data returned by the query
   */
  data: T[];

  /**
   * Query statistics
   */
  statistics?: {
    /**
     * Number of rows read
     */
    rows_read?: number;

    /**
     * Number of bytes read
     */
    bytes_read?: number;

    /**
     * Time elapsed for query execution in seconds
     */
    elapsed?: number;

    /**
     * Rows returned by the query
     */
    rows_returned?: number;
  };

  /**
   * Query execution metadata
   */
  meta?: Array<{
    /**
     * Column name
     */
    name: string;

    /**
     * Column type
     */
    type: string;
  }>;
}
