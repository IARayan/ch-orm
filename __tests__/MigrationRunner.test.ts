import { Connection } from "../src/connection/Connection";
import { Migration } from "../src/schema/Migration";
import { MigrationRunner } from "../src/schema/MigrationRunner";
import { Schema } from "../src/schema/Schema";

// Mock dependencies
jest.mock("../src/schema/Schema");
jest.mock("../src/connection/Connection");

// Create test migration classes
class TestMigration1 extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("test_table1", () => {});
  }

  public async down(): Promise<void> {
    await this.schema.drop("test_table1");
  }
}

class TestMigration2 extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("test_table2", () => {});
  }

  public async down(): Promise<void> {
    await this.schema.drop("test_table2");
  }
}

describe("MigrationRunner", () => {
  let connection: Connection;
  let runner: MigrationRunner;
  let migrations: Migration[];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup connection mock
    connection = new Connection({});
    (connection.execute as jest.Mock).mockResolvedValue([]);
    (connection.query as jest.Mock).mockResolvedValue([]);

    // Create migrations
    migrations = [
      new TestMigration1(connection),
      new TestMigration2(connection),
    ];

    // Create migration runner
    runner = new MigrationRunner(connection);

    // Setup Schema mock for creating migrations table
    (Schema.prototype.create as jest.Mock).mockImplementation(
      async (tableName, callback) => {
        if (tableName === "migrations") {
          // Call the blueprint callback to satisfy migration runner
          const mockBlueprint = {
            string: jest.fn().mockReturnThis(),
            dateTime: jest.fn().mockReturnThis(),
            primaryKey: jest.fn(),
            engine: jest.fn(),
            orderBy: jest.fn(),
            int32: jest.fn(),
            float64: jest.fn(),
            replacingMergeTree: jest.fn(),
          };
          callback(mockBlueprint);
          return Promise.resolve();
        }
        return Promise.resolve();
      }
    );

    // Mock hasTable to simulate migrations table existing
    (Schema.prototype.hasTable as jest.Mock).mockResolvedValue(true);

    // Add a method to find migrations by name
    (runner as any).getMigrationByName = (name: string): Migration | null => {
      for (const migration of migrations) {
        if (migration.getName() === name) {
          return migration;
        }
      }
      return null;
    };
  });

  describe("constructor", () => {
    it("should create a migration runner with connection", () => {
      expect(runner).toBeInstanceOf(MigrationRunner);

      // Access protected properties for testing
      const privateRunner = runner as any;
      expect(privateRunner.connection).toBe(connection);
      expect(privateRunner.schema).toBeInstanceOf(Schema);
    });
  });

  describe("createMigrationsTable", () => {
    it("should create the migrations table if it does not exist", async () => {
      // Mock the migrations table to not exist
      (Schema.prototype.hasTable as jest.Mock).mockResolvedValueOnce(false);

      // Call the method
      await (runner as any).createMigrationsTable();

      // Verify table creation was attempted
      expect(Schema.prototype.hasTable).toHaveBeenCalledWith("migrations");
      expect(Schema.prototype.create).toHaveBeenCalledWith(
        "migrations",
        expect.any(Function)
      );
    });

    it("should not create the migrations table if it already exists", async () => {
      // Mock the migrations table to already exist
      (Schema.prototype.hasTable as jest.Mock).mockResolvedValueOnce(true);

      // Call the method
      await (runner as any).createMigrationsTable();

      // Verify table creation was not attempted
      expect(Schema.prototype.hasTable).toHaveBeenCalledWith("migrations");
      expect(Schema.prototype.create).not.toHaveBeenCalledWith(
        "migrations",
        expect.any(Function)
      );
    });
  });
});
