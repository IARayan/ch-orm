import { Connection } from "../src/connection/Connection";
import { Schema } from "../src/schema/Schema";

// Mock dependencies
jest.mock("../src/connection/Connection");

describe("Schema Basic Tests", () => {
  let schema: Schema;
  let connection: Connection;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock connection
    connection = new Connection({});
    (connection.query as jest.Mock).mockResolvedValue({ data: [] });

    // Create schema instance
    schema = new Schema(connection);
  });

  describe("constructor", () => {
    it("should create a schema with connection", () => {
      expect(schema).toBeInstanceOf(Schema);
    });
  });

  describe("create", () => {
    it("should create a table", async () => {
      await schema.create("test_table", (table) => {
        table.string("name");
        table.int32("id");
      });

      expect(connection.query).toHaveBeenCalled();
    });
  });

  describe("drop", () => {
    it("should drop a table", async () => {
      await schema.drop("test_table", false);

      expect(connection.query).toHaveBeenCalled();
    });

    it("should drop a table if it exists", async () => {
      await schema.drop("test_table", true);

      expect(connection.query).toHaveBeenCalled();
    });
  });

  describe("hasTable", () => {
    it("should check if a table exists", async () => {
      (connection.query as jest.Mock).mockResolvedValue({
        data: [{ name: "test_table" }],
      });

      const exists = await schema.hasTable("test_table");

      expect(exists).toBe(true);
      expect(connection.query).toHaveBeenCalled();
    });

    it("should return false if a table does not exist", async () => {
      (connection.query as jest.Mock).mockResolvedValue({ data: [] });

      const exists = await schema.hasTable("nonexistent_table");

      expect(exists).toBe(false);
      expect(connection.query).toHaveBeenCalled();
    });
  });
});
