import * as http from "http";
import * as https from "https";
import { Connection } from "../src/connection/Connection";

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

describe("Connection", () => {
  let connection: Connection;

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
    connection = new Connection({
      host: "localhost",
      port: 8123,
      database: "test",
      username: "default",
      password: "",
    });
  });

  describe("constructor", () => {
    it("should create a connection with default values", () => {
      const conn = new Connection({});

      expect(conn).toBeInstanceOf(Connection);

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
      const conn = new Connection({
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
});
