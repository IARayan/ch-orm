import { ConnectionConfig } from "../types/connection";
import { ClickHouseConnection } from "./ClickHouseConnection";

/**
 * Options for connection pool
 */
export interface ConnectionPoolOptions {
  /**
   * Minimum number of connections to keep in the pool
   * @default 1
   */
  minConnections?: number;

  /**
   * Maximum number of connections to allow in the pool
   * @default 10
   */
  maxConnections?: number;

  /**
   * Time in ms after which idle connections are removed from the pool
   * @default 60000 (1 minute)
   */
  idleTimeoutMillis?: number;

  /**
   * Time in ms to wait for a connection to become available
   * @default 30000 (30 seconds)
   */
  acquireTimeoutMillis?: number;

  /**
   * Whether to validate connections before returning them
   * @default true
   */
  validateOnBorrow?: boolean;
}

/**
 * Connection pool for managing multiple ClickHouse connections
 * Provides automatic connection management, retry logic, and error handling
 */
export class ConnectionPool {
  /**
   * Minimum number of connections to keep in the pool
   */
  private minConnections: number;

  /**
   * Maximum number of connections to allow in the pool
   */
  private maxConnections: number;

  /**
   * Time in ms after which idle connections are removed from the pool
   */
  private idleTimeoutMillis: number;

  /**
   * Time in ms to wait for a connection to become available
   */
  private acquireTimeoutMillis: number;

  /**
   * Whether to validate connections before returning them
   */
  private validateOnBorrow: boolean;

  /**
   * Database connection options
   */
  private connectionOptions: ConnectionConfig;

  /**
   * Pool of available connections
   */
  private availableConnections: Array<{
    connection: ClickHouseConnection;
    lastUsed: number;
  }> = [];

  /**
   * Currently borrowed connections
   */
  private borrowedConnections: Set<ClickHouseConnection> = new Set();

  /**
   * Queue of pending requests for connections
   */
  private waitingClients: Array<{
    resolve: (connection: ClickHouseConnection) => void;
    reject: (error: Error) => void;
    timeoutId: NodeJS.Timeout;
  }> = [];

  /**
   * Interval for idle connection cleanup
   */
  private cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Create a new connection pool
   * @param connectionOptions - Options for ClickHouse connections
   * @param poolOptions - Options for the connection pool
   */
  constructor(
    connectionOptions: ConnectionConfig,
    poolOptions: ConnectionPoolOptions = {}
  ) {
    this.connectionOptions = connectionOptions;
    this.minConnections = poolOptions.minConnections ?? 1;
    this.maxConnections = poolOptions.maxConnections ?? 10;
    this.idleTimeoutMillis = poolOptions.idleTimeoutMillis ?? 60000;
    this.acquireTimeoutMillis = poolOptions.acquireTimeoutMillis ?? 30000;
    this.validateOnBorrow = poolOptions.validateOnBorrow ?? true;

    // Initialize the pool with minimum connections
    this.initialize();

    // Start the cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.removeIdleConnections();
    }, Math.min(30000, this.idleTimeoutMillis));
  }

  /**
   * Initialize the pool with minimum connections
   */
  private async initialize(): Promise<void> {
    try {
      for (let i = 0; i < this.minConnections; i++) {
        const connection = new ClickHouseConnection(this.connectionOptions);
        // Test the connection to ensure it's valid
        await connection.ping();
        this.availableConnections.push({
          connection,
          lastUsed: Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to initialize connection pool:", error);
    }
  }

  /**
   * Get a connection from the pool
   * @returns Promise that resolves to a connection
   */
  public async getConnection(): Promise<ClickHouseConnection> {
    // If there are available connections, use one
    if (this.availableConnections.length > 0) {
      const { connection } = this.availableConnections.shift()!;

      // Validate the connection if needed
      if (this.validateOnBorrow) {
        try {
          const isValid = await connection.ping();
          if (!isValid) {
            // Connection is invalid, create a new one
            return this.createConnection();
          }
        } catch (error) {
          // Error during validation, create a new connection
          return this.createConnection();
        }
      }

      // Add the connection to borrowed set
      this.borrowedConnections.add(connection);
      return connection;
    }

    // If we can create more connections, do so
    if (this.borrowedConnections.size < this.maxConnections) {
      return this.createConnection();
    }

    // Otherwise, wait for a connection to become available
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        // Remove the client from the waiting queue
        this.waitingClients = this.waitingClients.filter(
          (client) => client.timeoutId !== timeoutId
        );

        reject(new Error("Timeout waiting for available connection"));
      }, this.acquireTimeoutMillis);

      this.waitingClients.push({ resolve, reject, timeoutId });
    });
  }

  /**
   * Release a connection back to the pool
   * @param connection - Connection to release
   */
  public releaseConnection(connection: ClickHouseConnection): void {
    // If the connection is borrowed, release it
    if (this.borrowedConnections.has(connection)) {
      this.borrowedConnections.delete(connection);

      // If there are waiting clients, give them the connection
      if (this.waitingClients.length > 0) {
        const { resolve, timeoutId } = this.waitingClients.shift()!;
        clearTimeout(timeoutId);
        this.borrowedConnections.add(connection);
        resolve(connection);
        return;
      }

      // Otherwise, add the connection back to the pool
      this.availableConnections.push({
        connection,
        lastUsed: Date.now(),
      });
    }
  }

  /**
   * Create a new connection
   * @returns Promise that resolves to a new connection
   */
  private async createConnection(): Promise<ClickHouseConnection> {
    const connection = new ClickHouseConnection(this.connectionOptions);

    try {
      // Test the connection to ensure it's valid
      await connection.ping();

      // Add the connection to borrowed set
      this.borrowedConnections.add(connection);

      return connection;
    } catch (error) {
      throw new Error(`Failed to create connection: ${error}`);
    }
  }

  /**
   * Remove idle connections from the pool
   */
  private removeIdleConnections(): void {
    const now = Date.now();
    const minIdleCount = this.minConnections - this.borrowedConnections.size;

    // Keep at least minConnections total connections
    if (minIdleCount > 0) {
      // Sort by last used (oldest first)
      this.availableConnections.sort((a, b) => a.lastUsed - b.lastUsed);

      // Get connections to remove (oldest idle connections beyond minimum)
      const connectionsToKeep = this.availableConnections.slice(
        0,
        minIdleCount
      );
      const connectionsToCheck = this.availableConnections.slice(minIdleCount);

      // Check which connections are idle
      const idleConnections = connectionsToCheck.filter(
        ({ lastUsed }) => now - lastUsed > this.idleTimeoutMillis
      );

      // Update the available connections
      this.availableConnections = [
        ...connectionsToKeep,
        ...connectionsToCheck.filter(
          ({ lastUsed }) => now - lastUsed <= this.idleTimeoutMillis
        ),
      ];

      // Close the idle connections
      for (const { connection } of idleConnections) {
        try {
          // No explicit close method on ClickHouseConnection, but can be added
          // connection.close();
        } catch (error) {
          console.error("Error closing idle connection:", error);
        }
      }
    }
  }

  /**
   * Execute a function with a connection from the pool
   * @param fn - Function to execute with the connection
   * @returns Promise that resolves to the function's result
   */
  public async withConnection<T>(
    fn: (connection: ClickHouseConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection();

    try {
      const result = await fn(connection);
      this.releaseConnection(connection);
      return result;
    } catch (error) {
      this.releaseConnection(connection);
      throw error;
    }
  }

  /**
   * Close all connections in the pool
   */
  public async close(): Promise<void> {
    // Clear the cleanup interval
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Clear waiting clients
    for (const { reject, timeoutId } of this.waitingClients) {
      clearTimeout(timeoutId);
      reject(new Error("Connection pool is closing"));
    }

    this.waitingClients = [];

    // Close all connections
    const allConnections = [
      ...this.availableConnections.map(({ connection }) => connection),
      ...this.borrowedConnections,
    ];

    this.availableConnections = [];
    this.borrowedConnections.clear();

    // Close each connection
    for (const connection of allConnections) {
      try {
        // No explicit close method on ClickHouseConnection, but can be added
        // await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}
