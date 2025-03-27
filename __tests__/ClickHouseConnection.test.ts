import * as http from "http";
import * as https from "https";
import { ClickHouseConnection } from "../src/connection/ClickHouseConnection";

// Define interfaces for mock objects
interface MockResponse {
  on: jest.Mock;
  setEncoding: jest.Mock;
}

interface MockRequest {
  on: jest.Mock;
  write: jest.Mock;
  end: jest.Mock;
}

// Mock HTTP and HTTPS modules
jest.mock("http");
jest.mock("https");

describe("ClickHouseConnection", () => {
  let connection: ClickHouseConnection;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock response
    const mockResponse: MockResponse = {
      on: jest.fn((event, callback) => {
        if (event === "data") {
          callback(Buffer.from(JSON.stringify({ data: [] })));
        }
        if (event === "end") {
          callback();
        }
        return mockResponse;
      }),
      setEncoding: jest.fn(),
    };

    const mockRequest: MockRequest = {
      on: jest.fn((event, callback) => {
        if (event === "error") {
          // Do nothing, we're not triggering errors by default
        }
        return mockRequest;
      }),
      write: jest.fn(),
      end: jest.fn(),
    };

    // Setup HTTP and HTTPS mocks
    (http.request as jest.Mock).mockImplementation((options, callback) => {
      callback(mockResponse);
      return mockRequest;
    });

    (https.request as jest.Mock).mockImplementation((options, callback) => {
      callback(mockResponse);
      return mockRequest;
    });

    // Create a new connection for each test
    connection = new ClickHouseConnection({
      host: "localhost",
      port: 8123,
      database: "test",
      username: "default",
      password: "",
    });
  });

  describe("constructor", () => {
    it("should create a connection with default values", () => {
      const conn = new ClickHouseConnection({});

      expect(conn).toBeInstanceOf(ClickHouseConnection);

      // Verify default values
      const config = conn.getConfig();
      expect(config.host).toBe("localhost");
      expect(config.port).toBe(8123);
      expect(config.protocol).toBe("http");
      expect(config.database).toBe("default");
      expect(config.username).toBe("default");
      expect(config.password).toBe("");
    });

    it("should override default values with provided configuration", () => {
      const conn = new ClickHouseConnection({
        host: "clickhouse.example.com",
        port: 9000,
        protocol: "https",
        database: "mydb",
        username: "user",
        password: "pass",
      });

      const config = conn.getConfig();
      expect(config.host).toBe("clickhouse.example.com");
      expect(config.port).toBe(9000);
      expect(config.protocol).toBe("https");
      expect(config.database).toBe("mydb");
      expect(config.username).toBe("user");
      expect(config.password).toBe("pass");
    });
  });

  describe("query", () => {
    it("should execute SQL query and return results", async () => {
      // Setup mock response
      const mockData = [{ id: 1, name: "Test" }];
      const mockResponse: MockResponse = {
        on: jest.fn((event, callback) => {
          if (event === "data") {
            callback(Buffer.from(JSON.stringify({ data: mockData })));
          }
          if (event === "end") {
            callback();
          }
          return mockResponse;
        }),
        setEncoding: jest.fn(),
      };

      (http.request as jest.Mock).mockImplementation((options, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis(),
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      const result = await connection.query("SELECT * FROM test");

      expect(result).toEqual(mockData);
      expect(http.request).toHaveBeenCalled();
    });

    it("should handle query errors", async () => {
      // Setup mock response for error
      const mockResponse: MockResponse = {
        on: jest.fn((event, callback) => {
          if (event === "data") {
            callback(Buffer.from(JSON.stringify({ error: "Query error" })));
          }
          if (event === "end") {
            callback();
          }
          return mockResponse;
        }),
        setEncoding: jest.fn(),
      };

      (http.request as jest.Mock).mockImplementation((options, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis(),
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      await expect(
        connection.query("SELECT * FROM invalid_table")
      ).rejects.toThrow("Query error");
    });
  });

  describe("execute", () => {
    it("should execute parameterized query with values", async () => {
      // Setup mock response
      const mockData = [{ affected_rows: 1 }];
      const mockResponse: MockResponse = {
        on: jest.fn((event, callback) => {
          if (event === "data") {
            callback(Buffer.from(JSON.stringify({ data: mockData })));
          }
          if (event === "end") {
            callback();
          }
          return mockResponse;
        }),
        setEncoding: jest.fn(),
      };

      (http.request as jest.Mock).mockImplementation((options, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis(),
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      const result = await connection.execute(
        "INSERT INTO test (id, name) VALUES (?, ?)",
        [1, "Test"]
      );

      expect(result).toEqual(mockData);
      expect(http.request).toHaveBeenCalled();
    });

    it("should handle execution errors", async () => {
      // Setup mock response for error
      const mockResponse: MockResponse = {
        on: jest.fn((event, callback) => {
          if (event === "data") {
            callback(Buffer.from(JSON.stringify({ error: "Execution error" })));
          }
          if (event === "end") {
            callback();
          }
          return mockResponse;
        }),
        setEncoding: jest.fn(),
      };

      (http.request as jest.Mock).mockImplementation((options, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis(),
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      await expect(
        connection.execute("INSERT INTO invalid_table (id) VALUES (?)", [1])
      ).rejects.toThrow("Execution error");
    });
  });

  describe("insert", () => {
    it("should insert single record", async () => {
      // Setup mock for execute method
      jest
        .spyOn(connection, "execute")
        .mockResolvedValue({ data: [{ affected_rows: 1 }] });

      const record = { id: 1, name: "Test" };
      const result = await connection.insert("test_table", record);

      expect(result).toEqual({ data: [{ affected_rows: 1 }] });
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO test_table"),
        expect.arrayContaining([1, "Test"])
      );
    });

    it("should insert multiple records", async () => {
      // Setup mock for execute method
      jest
        .spyOn(connection, "execute")
        .mockResolvedValue({ data: [{ affected_rows: 2 }] });

      const records = [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" },
      ];
      const result = await connection.insert("test_table", records);

      expect(result).toEqual({ data: [{ affected_rows: 2 }] });
      expect(connection.execute).toHaveBeenCalled();
    });
  });

  describe("ping", () => {
    it("should return true for successful ping", async () => {
      // Setup mock response for successful ping
      const mockResponse = {
        on: jest.fn((event, callback) => {
          if (event === "data") {
            callback(Buffer.from(JSON.stringify({ data: [{ result: 1 }] })));
          }
          if (event === "end") {
            callback();
          }
          return mockResponse;
        }),
        setEncoding: jest.fn(),
      };

      (http.request as jest.Mock).mockImplementation((options, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis(),
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      const result = await connection.ping();

      expect(result).toBe(true);
    });

    it("should return false for failed ping", async () => {
      // Setup mock for request that throws an error
      (http.request as jest.Mock).mockImplementation((options, callback) => {
        return {
          on: jest.fn((event, callbackFn) => {
            if (event === "error") {
              callbackFn(new Error("Connection refused"));
            }
            return this;
          }),
          write: jest.fn(),
          end: jest.fn(),
        };
      });

      const result = await connection.ping();

      expect(result).toBe(false);
    });
  });
});
