import { Blueprint } from "../src/schema/Blueprint";

describe("Blueprint Basic Tests", () => {
  let blueprint: Blueprint;

  beforeEach(() => {
    blueprint = new Blueprint("test_table");
  });

  describe("constructor", () => {
    it("should create a blueprint with table name", () => {
      expect(blueprint).toBeInstanceOf(Blueprint);
    });
  });

  describe("column definitions", () => {
    it("should add a string column", () => {
      blueprint.string("name");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("name");
      expect(columns[0].type).toBe("String");
    });

    it("should add an int32 column", () => {
      blueprint.int32("id");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("id");
      expect(columns[0].type).toBe("Int32");
    });

    it("should add a float64 column", () => {
      blueprint.float64("price");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("price");
      expect(columns[0].type).toBe("Float64");
    });

    it("should add a date column", () => {
      blueprint.date("created_date");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("created_date");
      expect(columns[0].type).toBe("Date");
    });

    it("should add a dateTime column", () => {
      blueprint.dateTime("created_at");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("created_at");
      expect(columns[0].type).toBe("DateTime");
    });

    it("should add a uuid column", () => {
      blueprint.uuid("id");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("id");
      expect(columns[0].type).toBe("UUID");
    });

    it("should add a boolean column", () => {
      blueprint.boolean("is_active");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("is_active");
      expect(columns[0].type).toBe("Bool");
    });

    it("should support fluent column options", () => {
      blueprint
        .string("username")
        .nullable()
        .comment("User's username")
        .default("'guest'");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("username");
      expect(columns[0].type).toBe("String");
      expect(columns[0].nullable).toBe(true);
      expect(columns[0].comment).toBe("User's username");
      expect(columns[0].default).toBe("'guest'");
    });

    it("should support the legacy options object", () => {
      blueprint.string("legacy_field", {
        nullable: true,
        comment: "Using legacy options object",
        default: "'default value'",
      });

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("legacy_field");
      expect(columns[0].type).toBe("String");
      expect(columns[0].nullable).toBe(true);
      expect(columns[0].comment).toBe("Using legacy options object");
      expect(columns[0].default).toBe("'default value'");
    });

    it("should support direct chaining to table methods", () => {
      blueprint
        .string("id")
        .default("generateUUIDv4()")
        .comment("Primary key")
        .orderBy("id");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0].name).toBe("id");
      expect(columns[0].type).toBe("String");
      expect(columns[0].default).toBe("generateUUIDv4()");
      expect(columns[0].comment).toBe("Primary key");

      const sql = blueprint.toSql();
      expect(sql).toContain("ORDER BY (id)");
    });
  });
});
