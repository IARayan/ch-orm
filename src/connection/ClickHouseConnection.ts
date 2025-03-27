import * as http from "http";
import * as https from "https";
import { URL } from "url";
import {
  ConnectionConfig,
  QueryOptions,
  QueryResult,
  ResultFormat,
} from "../types/connection";
import { formatValue } from "../utils/helpers";

/**
 * ClickHouseConnection class for managing connections to a ClickHouse server
 * Handles query execution and manages connection state
 */
export class ClickHouseConnection {
  /**
   * Configuration for this connection
   */
  private config: ConnectionConfig;

  /**
   * Base URL for ClickHouse HTTP interface
   */
  private baseUrl: string;

  /**
   * HTTP module to use (http or https)
   */
  private httpModule: typeof http | typeof https;

  /**
   * Default query options
   */
  private defaultQueryOptions: QueryOptions = {
    format: ResultFormat.JSON,
  };

  /**
   * Create a new ClickHouse connection
   * @param config - Connection configuration
   */
  constructor(config: Partial<ConnectionConfig>) {
    // Set default values for configuration
    this.config = {
      host: "localhost",
      port: 8123,
      database: "default",
      username: "default",
      password: "",
      protocol: "http",
      timeout: 30000,
      maxConnections: 10,
      debug: false,
      ...config,
    };

    // Initialize the base URL and HTTP module
    this.baseUrl = `${this.config.protocol}://${this.config.host}:${this.config.port}`;
    this.httpModule = this.config.protocol === "https" ? https : http;
  }

  /**
   * Execute a raw SQL query
   * @param sql - SQL query to execute
   * @param options - Query options
   * @returns Query result
   */
  public async query<T = any>(
    sql: string,
    options?: QueryOptions
  ): Promise<QueryResult<T>> {
    // Merge options with defaults
    const queryOptions = { ...this.defaultQueryOptions, ...options };

    // Build URL with query parameters
    const url = new URL(this.baseUrl);

    // Set database
    url.searchParams.append("database", this.config.database);

    // Add other query parameters
    if (queryOptions.session_id) {
      url.searchParams.append("session_id", queryOptions.session_id);
    }

    if (queryOptions.timeout_seconds) {
      url.searchParams.append(
        "timeout_seconds",
        queryOptions.timeout_seconds.toString()
      );
    }

    if (queryOptions.max_rows_to_read) {
      url.searchParams.append(
        "max_rows_to_read",
        queryOptions.max_rows_to_read.toString()
      );
    }

    // Add format
    url.searchParams.append(
      "default_format",
      queryOptions.format || ResultFormat.JSON
    );

    // Add ClickHouse specific settings
    if (queryOptions.clickhouse_settings) {
      Object.entries(queryOptions.clickhouse_settings).forEach(
        ([key, value]) => {
          url.searchParams.append(key, value.toString());
        }
      );
    }

    // Log the query if debug mode is enabled
    if (this.config.debug) {
      console.log("ClickHouse Query:", sql);
      console.log("URL:", url.toString());
    }

    // Execute the HTTP request
    try {
      const result = await this.executeRequest(url, sql);

      // Log the result if debug mode is enabled
      if (this.config.debug) {
        console.log("ClickHouse Result:", JSON.stringify(result, null, 2));
      }

      return result;
    } catch (error: any) {
      // Log the error if debug mode is enabled
      if (this.config.debug) {
        console.error("ClickHouse Error:", error.message);
      }

      throw error;
    }
  }

  /**
   * Execute a parameterized query with values
   * @param sql - SQL query with placeholders (?)
   * @param params - Parameter values
   * @param options - Query options
   * @returns Query result
   */
  public async execute<T = any>(
    sql: string,
    params: any[] = [],
    options?: QueryOptions
  ): Promise<QueryResult<T>> {
    // Replace parameters with formatted values
    let index = 0;
    const formattedSql = sql.replace(/\?/g, () => {
      const value = params[index++];
      return formatValue(value);
    });

    return this.query<T>(formattedSql, options);
  }

  /**
   * Execute a simple INSERT query
   * @param table - Table name
   * @param data - Data to insert (object or array of objects)
   * @param options - Query options
   * @returns Query result
   */
  public async insert<T = any>(
    table: string,
    data: Record<string, any> | Record<string, any>[],
    options?: QueryOptions
  ): Promise<QueryResult<T>> {
    // Convert single object to array
    const rows = Array.isArray(data) ? data : [data];

    if (rows.length === 0) {
      throw new Error("No data provided for insert");
    }

    // Get column names from the first row
    const columns = Object.keys(rows[0]);

    if (columns.length === 0) {
      throw new Error("No columns found in data");
    }

    // Build the insert query
    let sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES `;

    // Add values for each row
    const values = rows
      .map((row) => {
        const rowValues = columns.map((column) => formatValue(row[column]));
        return `(${rowValues.join(", ")})`;
      })
      .join(", ");

    sql += values;

    return this.query<T>(sql, options);
  }

  /**
   * Execute a HTTP request to ClickHouse
   * @param url - Request URL
   * @param body - Request body (SQL query)
   * @returns Query result
   */
  private executeRequest(url: URL, body: string): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      // Request options
      const options: http.RequestOptions = {
        method: "POST",
        timeout: this.config.timeout,
        auth: `${this.config.username}:${this.config.password}`,
      };

      // Create request
      const req = this.httpModule.request(url, options, (res) => {
        let data = "";

        // Handle data chunks
        res.on("data", (chunk) => {
          data += chunk;
        });

        // Handle end of response
        res.on("end", () => {
          // Check for HTTP error
          if (
            res.statusCode &&
            (res.statusCode < 200 || res.statusCode >= 300)
          ) {
            return reject(new Error(`HTTP Error ${res.statusCode}: ${data}`));
          }

          // Check if this is a DDL statement (CREATE, ALTER, DROP, etc.)
          const isDDL = /^(CREATE|ALTER|DROP|TRUNCATE|RENAME)/i.test(
            body.trim()
          );

          // For DDL statements or empty responses, return success
          if (isDDL || !data.trim()) {
            return resolve({
              data: [],
              statistics: {
                elapsed: 0,
                rows_read: 0,
                bytes_read: 0,
              },
              meta: [],
            });
          }

          try {
            // Parse response as JSON
            const result = JSON.parse(data);

            // Return formatted result
            resolve({
              data: result.data || [],
              statistics: result.statistics || {
                elapsed: 0,
                rows_read: 0,
                bytes_read: 0,
              },
              meta: result.meta || [],
            });
          } catch (error) {
            reject(new Error(`Failed to parse ClickHouse response: ${error}`));
          }
        });
      });

      // Handle request errors
      req.on("error", (error) => {
        reject(new Error(`ClickHouse request failed: ${error.message}`));
      });

      // Handle timeout
      req.on("timeout", () => {
        req.destroy();
        reject(
          new Error(
            `ClickHouse request timed out after ${this.config.timeout}ms`
          )
        );
      });

      // Send the query
      req.write(body);
      req.end();
    });
  }

  /**
   * Ping the ClickHouse server to test the connection
   * @returns True if connected successfully
   */
  public async ping(): Promise<boolean> {
    try {
      await this.query("SELECT 1");
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get information about the ClickHouse server
   * @returns Server information
   */
  public async serverInfo(): Promise<any> {
    const result = await this.query("SELECT * FROM system.build_options");
    return result.data;
  }

  /**
   * List databases on the ClickHouse server
   * @returns Array of database names
   */
  public async listDatabases(): Promise<string[]> {
    const result = await this.query("SHOW DATABASES");
    return result.data.map((row: any) => row.name);
  }

  /**
   * List tables in the current database
   * @returns Array of table names
   */
  public async listTables(): Promise<string[]> {
    const result = await this.query("SHOW TABLES");
    return result.data.map((row: any) => row.name);
  }

  /**
   * Get table schema information
   * @param table - Table name
   * @returns Table schema information
   */
  public async describeTable(table: string): Promise<any[]> {
    const result = await this.query(`DESCRIBE TABLE ${table}`);
    return result.data;
  }

  /**
   * Create a new database
   * @param database - Database name
   * @returns Query result
   */
  public async createDatabase(database: string): Promise<QueryResult> {
    return this.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
  }

  /**
   * Drop a database
   * @param database - Database name
   * @returns Query result
   */
  public async dropDatabase(database: string): Promise<QueryResult> {
    return this.query(`DROP DATABASE IF EXISTS ${database}`);
  }

  /**
   * Get the current connection configuration
   * @returns Connection configuration
   */
  public getConfig(): ConnectionConfig {
    return { ...this.config };
  }

  /**
   * Close the connection
   * This is a no-op for HTTP connections but included for API compatibility
   */
  public async close(): Promise<void> {
    // HTTP connections are stateless, so no cleanup needed
    return Promise.resolve();
  }
}
