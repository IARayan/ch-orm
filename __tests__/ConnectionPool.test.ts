import { Connection } from "../src/connection/Connection";
import { ConnectionPool } from "../src/connection/ConnectionPool";

// Mock Connection
jest.mock("../src/connection/Connection");

describe("ConnectionPool", () => {
  let pool: ConnectionPool;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Connection methods
    (Connection as jest.Mock).mockImplementation(() => ({
      query: jest.fn().mockResolvedValue([]),
      execute: jest.fn().mockResolvedValue([]),
      insert: jest.fn().mockResolvedValue([]),
      ping: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(undefined),
    }));

    // Create a new pool for each test
    pool = new ConnectionPool(
      {
        host: "localhost",
        port: 8123,
        database: "test",
        username: "default",
        password: "",
      },
      {
        maxConnections: 5,
        acquireTimeoutMillis: 5000,
      }
    );
  });

  describe("constructor", () => {
    it("should create a pool with default options", () => {
      const defaultPool = new ConnectionPool({
        host: "localhost",
        port: 8123,
        database: "default",
        username: "default",
        password: "",
      });

      expect(defaultPool).toBeInstanceOf(ConnectionPool);
    });

    it("should override default options with provided options", () => {
      expect(pool).toBeInstanceOf(ConnectionPool);

      // Access private properties for testing
      const privatePool = pool as any;
      expect(privatePool.maxConnections).toBe(5);
      expect(privatePool.acquireTimeoutMillis).toBe(5000);
    });
  });

  describe("getConnection", () => {
    it("should create a new connection if none available", async () => {
      const connection = await pool.getConnection();

      expect(connection).toBeDefined();
      expect(Connection).toHaveBeenCalled();
    });

    it("should reuse an existing connection from the pool", async () => {
      // Get a connection and release it to the pool
      const conn1 = await pool.getConnection();
      pool.releaseConnection(conn1);

      // Mock to intercept the next connection request
      const connSpy = jest.spyOn(pool as any, "createConnection");

      // Get a connection again, which should be the one we just released
      const conn2 = await pool.getConnection();

      expect(conn2).toBeDefined();
      expect(connSpy).not.toHaveBeenCalled(); // Should not create a new connection
    });
  });

  describe("releaseConnection", () => {
    it("should release a borrowed connection back to the pool", async () => {
      // Get a connection
      const connection = await pool.getConnection();

      // Mock ping to verify the connection is good
      (connection.ping as jest.Mock).mockResolvedValue(true);

      // Release it
      pool.releaseConnection(connection);

      // Verify it was released to the pool
      const privatePool = pool as any;
      expect(privatePool.availableConnections.length).toBeGreaterThan(0);
    });
  });

  describe("withConnection", () => {
    it("should execute a callback with a connection and release it", async () => {
      const callback = jest.fn().mockResolvedValue("result");

      const result = await pool.withConnection(callback);

      expect(result).toBe("result");
      expect(callback).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should release the connection even if the callback throws", async () => {
      const callback = jest.fn().mockImplementation(() => {
        throw new Error("Test error");
      });

      await expect(pool.withConnection(callback)).rejects.toThrow("Test error");
      expect(callback).toHaveBeenCalledWith(expect.any(Object));

      // The connection should still be released and available
      const privatePool = pool as any;
      expect(privatePool.availableConnections.length).toBeGreaterThan(0);
    });
  });

  describe("close", () => {
    it("should close the pool and all connections", async () => {
      // Get a few connections to have some in the pool
      const conn1 = await pool.getConnection();
      const conn2 = await pool.getConnection();

      // Mock the connection close method
      const closeSpy = jest.fn();
      (conn1 as any).close = closeSpy;
      (conn2 as any).close = closeSpy;

      // Release one connection to the pool
      pool.releaseConnection(conn1);

      // Close the pool
      await pool.close();

      // Verify close was called for all connections
      expect(closeSpy).toHaveBeenCalledTimes(2);

      // Verify the pool is now empty
      const privatePool = pool as any;
      expect(privatePool.availableConnections.length).toBe(0);
      expect(privatePool.borrowedConnections.size).toBe(0);
    });
  });
});
