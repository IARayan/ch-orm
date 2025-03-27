import { ClickHouseConnection } from "../src/connection/ClickHouseConnection";
import { Migration } from "../src/schema/Migration";
import { MigrationRunner } from "../src/schema/MigrationRunner";
import { Schema } from "../src/schema/Schema";

// Mock dependencies
jest.mock("../src/schema/Schema");
jest.mock("../src/connection/ClickHouseConnection");

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
  let connection: ClickHouseConnection;
  let runner: MigrationRunner;
  let migrations: Migration[];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup connection mock
    connection = new ClickHouseConnection({});
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

  describe("run", () => {
    it("should run pending migrations", async () => {
      // Mock the migrations table to be empty
      (connection.query as jest.Mock).mockResolvedValue([]);

      // Spy on migration apply methods
      const migration1ApplySpy = jest.spyOn(migrations[0], "apply");
      const migration2ApplySpy = jest.spyOn(migrations[1], "apply");

      // Set the migrations
      runner.setMigrations(migrations);

      // Run migrations
      await runner.run();

      // Verify all migrations were applied
      expect(migration1ApplySpy).toHaveBeenCalled();
      expect(migration2ApplySpy).toHaveBeenCalled();

      // Verify migrations were recorded in the database
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO migrations"),
        expect.arrayContaining(["TestMigration1"])
      );
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO migrations"),
        expect.arrayContaining(["TestMigration2"])
      );
    });

    it("should skip already applied migrations", async () => {
      // Mock the migrations table to show the first migration is already applied
      (connection.query as jest.Mock).mockResolvedValue([
        { name: "TestMigration1", batch: 1 },
      ]);

      // Spy on migration apply methods
      const migration1ApplySpy = jest.spyOn(migrations[0], "apply");
      const migration2ApplySpy = jest.spyOn(migrations[1], "apply");

      // Set the migrations
      runner.setMigrations(migrations);

      // Run migrations
      await runner.run();

      // Verify only the second migration was applied
      expect(migration1ApplySpy).not.toHaveBeenCalled();
      expect(migration2ApplySpy).toHaveBeenCalled();

      // Verify only the second migration was recorded
      expect(connection.execute).not.toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO migrations"),
        expect.arrayContaining(["TestMigration1"])
      );
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO migrations"),
        expect.arrayContaining(["TestMigration2"])
      );
    });
  });

  describe("rollback", () => {
    it("should rollback the last batch of migrations", async () => {
      // Mock the migrations table to show both migrations in the same batch
      (connection.query as jest.Mock).mockResolvedValue([
        { name: "TestMigration1", batch: 1 },
        { name: "TestMigration2", batch: 1 },
      ]);

      // Spy on migration revert methods
      const migration1RevertSpy = jest.spyOn(migrations[0], "revert");
      const migration2RevertSpy = jest.spyOn(migrations[1], "revert");

      // Set the migrations
      runner.setMigrations(migrations);

      // Rollback migrations
      await runner.rollback();

      // Verify both migrations were reverted (in reverse order)
      expect(migration2RevertSpy).toHaveBeenCalled();
      expect(migration1RevertSpy).toHaveBeenCalled();

      // Verify migrations were removed from the database
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM migrations WHERE name = ?"),
        expect.arrayContaining(["TestMigration1"])
      );
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM migrations WHERE name = ?"),
        expect.arrayContaining(["TestMigration2"])
      );
    });

    it("should rollback only the specified batch", async () => {
      // Mock the migrations table to show migrations in different batches
      (connection.query as jest.Mock).mockResolvedValue([
        { name: "TestMigration1", batch: 1 },
        { name: "TestMigration2", batch: 2 },
      ]);

      // Spy on migration revert methods
      const migration1RevertSpy = jest.spyOn(migrations[0], "revert");
      const migration2RevertSpy = jest.spyOn(migrations[1], "revert");

      // Set the migrations
      runner.setMigrations(migrations);

      // Rollback the latest batch (batch 2)
      await runner.rollback();

      // Verify only the second migration was reverted
      expect(migration1RevertSpy).not.toHaveBeenCalled();
      expect(migration2RevertSpy).toHaveBeenCalled();

      // Verify only the second migration was removed
      expect(connection.execute).not.toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM migrations WHERE name = ?"),
        expect.arrayContaining(["TestMigration1"])
      );
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM migrations WHERE name = ?"),
        expect.arrayContaining(["TestMigration2"])
      );
    });
  });

  describe("reset", () => {
    it("should rollback all migrations", async () => {
      // Mock the migrations table to show both migrations
      (connection.query as jest.Mock).mockResolvedValue([
        { name: "TestMigration1", batch: 1 },
        { name: "TestMigration2", batch: 2 },
      ]);

      // Spy on migration revert methods
      const migration1RevertSpy = jest.spyOn(migrations[0], "revert");
      const migration2RevertSpy = jest.spyOn(migrations[1], "revert");

      // Set the migrations
      runner.setMigrations(migrations);

      // Reset all migrations
      await runner.reset();

      // Verify both migrations were reverted (in reverse order)
      expect(migration2RevertSpy).toHaveBeenCalled();
      expect(migration1RevertSpy).toHaveBeenCalled();

      // Verify migrations were removed from the database
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM migrations WHERE name = ?"),
        expect.arrayContaining(["TestMigration1"])
      );
      expect(connection.execute).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM migrations WHERE name = ?"),
        expect.arrayContaining(["TestMigration2"])
      );
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
