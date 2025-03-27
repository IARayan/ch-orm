import { Connection } from "../src/connection/Connection";
import { Migration } from "../src/schema/Migration";
import { Schema } from "../src/schema/Schema";

// Mock dependencies
jest.mock("../src/schema/Schema");
jest.mock("../src/connection/Connection");

// Create a concrete migration class for testing
class TestMigration extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("test_table", (table) => {
      table.string("name");
      table.int32("id").comment("Primary key");
    });
  }

  public async down(): Promise<void> {
    await this.schema.drop("test_table");
  }
}

describe("Migration", () => {
  let connection: Connection;
  let migration: TestMigration;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup connection mock
    connection = new Connection({});

    // Setup Schema mock
    (Schema.prototype.create as jest.Mock).mockResolvedValue(undefined);
    (Schema.prototype.drop as jest.Mock).mockResolvedValue(undefined);

    // Create test migration instance
    migration = new TestMigration(connection);
  });

  describe("constructor", () => {
    it("should create a migration instance with connection", () => {
      expect(migration).toBeInstanceOf(Migration);

      // Access protected properties for testing
      expect(migration.name).toBe("TestMigration");
      expect((migration as any).connection).toBe(connection);
      expect((migration as any).schema).toBeInstanceOf(Schema);
    });
  });

  describe("apply", () => {
    it("should call the up method", async () => {
      // Spy on up method
      const upSpy = jest.spyOn(migration, "up");

      await migration.apply();

      expect(upSpy).toHaveBeenCalled();
      expect(Schema.prototype.create).toHaveBeenCalled();
      expect(migration.isApplied()).toBe(true);
    });

    it("should throw an error if migration is already applied", async () => {
      // Apply migration once
      await migration.apply();

      // Try to apply again
      await expect(migration.apply()).rejects.toThrow("already been applied");
    });

    it("should throw an error if up method fails", async () => {
      // Make up method throw an error
      jest.spyOn(migration, "up").mockRejectedValue(new Error("Test error"));

      await expect(migration.apply()).rejects.toThrow(
        "Failed to apply migration"
      );
      expect(migration.isApplied()).toBe(false);
    });
  });

  describe("revert", () => {
    it("should call the down method", async () => {
      // Apply migration first
      await migration.apply();

      // Spy on down method
      const downSpy = jest.spyOn(migration, "down");

      await migration.revert();

      expect(downSpy).toHaveBeenCalled();
      expect(Schema.prototype.drop).toHaveBeenCalled();
      expect(migration.isApplied()).toBe(false);
    });

    it("should throw an error if migration is not applied", async () => {
      await expect(migration.revert()).rejects.toThrow("has not been applied");
    });

    it("should throw an error if down method fails", async () => {
      // Apply migration first
      await migration.apply();

      // Make down method throw an error
      jest.spyOn(migration, "down").mockRejectedValue(new Error("Test error"));

      await expect(migration.revert()).rejects.toThrow(
        "Failed to revert migration"
      );
      expect(migration.isApplied()).toBe(true);
    });
  });

  describe("getName", () => {
    it("should return the migration name", () => {
      expect(migration.getName()).toBe("TestMigration");
    });
  });

  describe("isApplied", () => {
    it("should return false for new migration", () => {
      expect(migration.isApplied()).toBe(false);
    });

    it("should return true after applying", async () => {
      await migration.apply();
      expect(migration.isApplied()).toBe(true);
    });
  });

  describe("setApplied", () => {
    it("should set the applied state", () => {
      migration.setApplied(true);
      expect(migration.isApplied()).toBe(true);

      migration.setApplied(false);
      expect(migration.isApplied()).toBe(false);
    });
  });
});
