import { Connection } from "../src/connection/Connection";
import { Schema } from "../src/schema/Schema";

// Mock dependencies
jest.mock("../src/connection/Connection");

describe("Schema", () => {
  let schema: Schema;
  let connection: Connection;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    connection = new Connection({});
    (connection.query as jest.Mock).mockResolvedValue({
      data: [],
    });

    // Create schema instance
    schema = new Schema(connection);
  });

  describe("constructor", () => {
    it("should create a schema with connection", () => {
      expect(schema).toBeInstanceOf(Schema);
      expect((schema as any).connection).toBe(connection);
    });
  });

  describe("schema methods", () => {
    it("should execute SQL statements for schema operations", async () => {
      // Create
      await schema.create("test_table", (table) => {
        table.string("name");
        table.int32("id").comment("Primary key");
        table.mergeTree();
        table.orderBy("id");
      });

      expect(connection.query).toHaveBeenCalled();

      // Drop
      await schema.drop("test_table");
      expect(connection.query).toHaveBeenCalled();

      // HasTable
      (connection.query as jest.Mock).mockResolvedValueOnce({
        data: [{ name: "test_table" }],
      });
      const exists = await schema.hasTable("test_table");
      expect(exists).toBe(true);

      // Alter
      await schema.alter("test_table", (table) => {
        table.string("email");
        table.dropColumn("old_column");
      });
      expect(connection.query).toHaveBeenCalled();

      // Views
      await schema.createView("test_view", "SELECT * FROM test_table");
      expect(connection.query).toHaveBeenCalled();

      await schema.dropView("test_view");
      expect(connection.query).toHaveBeenCalled();

      // Materialized Views
      await schema.createMaterializedView(
        "test_view",
        "SELECT * FROM test_table",
        undefined,
        "MergeTree() ORDER BY id"
      );
      expect(connection.query).toHaveBeenCalled();

      await schema.dropMaterializedView("test_view");
      expect(connection.query).toHaveBeenCalled();

      // Database
      await schema.createDatabase("test_db");
      expect(connection.query).toHaveBeenCalled();

      await schema.dropDatabase("test_db");
      expect(connection.query).toHaveBeenCalled();

      // Raw
      await schema.raw("INSERT INTO test VALUES (42)");
      expect(connection.query).toHaveBeenCalled();
    });
  });
});
