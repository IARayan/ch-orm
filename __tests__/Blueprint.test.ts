import { Blueprint } from "../src/schema/Blueprint";

describe("Blueprint", () => {
  let blueprint: Blueprint;

  beforeEach(() => {
    blueprint = new Blueprint("test_table");
  });

  describe("constructor", () => {
    it("should create a blueprint with table name", () => {
      expect(blueprint).toBeInstanceOf(Blueprint);
      expect(blueprint.getTableName()).toBe("test_table");
    });
  });

  describe("column definitions", () => {
    it("should add a string column", () => {
      blueprint.string("name");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "name",
          type: "String",
        })
      );
    });

    it("should add a string column with options", () => {
      blueprint.string("name", {
        nullable: true,
        comment: "User name",
      });

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "name",
          type: "String",
          nullable: true,
          comment: "User name",
        })
      );
    });

    it("should add an int32 column", () => {
      blueprint.int32("id");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "id",
          type: "Int32",
        })
      );
    });

    it("should add a float64 column", () => {
      blueprint.float64("price");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "price",
          type: "Float64",
        })
      );
    });

    it("should add a date column", () => {
      blueprint.date("created_date");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "created_date",
          type: "Date",
        })
      );
    });

    it("should add a dateTime column", () => {
      blueprint.dateTime("created_at");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "created_at",
          type: "DateTime",
        })
      );
    });

    it("should add a uuid column", () => {
      blueprint.uuid("id");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "id",
          type: "UUID",
        })
      );
    });

    it("should add a boolean column", () => {
      blueprint.boolean("is_active");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "is_active",
          type: "Bool",
        })
      );
    });

    it("should add a decimal column", () => {
      blueprint.decimal("price", 10, 2);

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "price",
          type: "Decimal(10, 2)",
        })
      );
    });

    it("should add an array column", () => {
      blueprint.array("tags", "String");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "tags",
          type: "Array(String)",
        })
      );
    });
  });

  describe("column modifiers", () => {
    it("should add a nullable modifier", () => {
      blueprint.string("name").nullable();

      const columns = blueprint.getColumns();
      expect(columns[0].nullable).toBe(true);
    });

    it("should add a default value modifier", () => {
      blueprint.int32("status").default("1");

      const columns = blueprint.getColumns();
      expect(columns[0].default).toBe("1");
    });

    it("should add a comment modifier", () => {
      blueprint.string("name").comment("User name");

      const columns = blueprint.getColumns();
      expect(columns[0].comment).toBe("User name");
    });

    it("should chain multiple modifiers", () => {
      blueprint
        .string("email")
        .nullable()
        .default("''")
        .comment("User email address");

      const columns = blueprint.getColumns();
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "email",
          type: "String",
          nullable: true,
          default: "''",
          comment: "User email address",
        })
      );
    });
  });

  describe("table engine", () => {
    it("should set MergeTree engine", () => {
      blueprint.mergeTree();

      // We can't directly test the private engine property, but we can check the SQL
      const sql = blueprint.toSql();
      expect(sql).toContain("ENGINE = MergeTree");
    });

    it("should set ReplacingMergeTree engine", () => {
      blueprint.replacingMergeTree("version");

      const sql = blueprint.toSql();
      expect(sql).toContain("ENGINE = ReplacingMergeTree");
      expect(sql).toContain("(version)");
    });
  });

  describe("table options", () => {
    it("should set order by", () => {
      blueprint.orderBy("id");

      const sql = blueprint.toSql();
      expect(sql).toContain("ORDER BY (id)");
    });

    it("should set order by with multiple columns", () => {
      blueprint.orderBy(["id", "created_at"]);

      const sql = blueprint.toSql();
      expect(sql).toContain("ORDER BY (id, created_at)");
    });

    it("should set partition by", () => {
      blueprint.partitionBy("toYYYYMM(created_at)");

      const sql = blueprint.toSql();
      expect(sql).toContain("PARTITION BY toYYYYMM(created_at)");
    });

    it("should set table settings", () => {
      blueprint.tableSettings({
        index_granularity: 8192,
      });

      const sql = blueprint.toSql();
      expect(sql).toContain("SETTINGS index_granularity = 8192");
    });
  });

  describe("index definitions", () => {
    it("should add a basic index", () => {
      blueprint.index("idx_name", "name");

      const sql = blueprint.toSql();
      expect(sql).toContain("INDEX idx_name name TYPE minmax");
    });

    it("should add an index with custom type", () => {
      blueprint.index("idx_name", "name", "set");

      const sql = blueprint.toSql();
      expect(sql).toContain("INDEX idx_name name TYPE set");
    });

    it("should add an index with custom granularity", () => {
      blueprint.index("idx_name", "name", "minmax", 4);

      const sql = blueprint.toSql();
      expect(sql).toContain("INDEX idx_name name TYPE minmax GRANULARITY 4");
    });
  });

  describe("sql generation", () => {
    it("should generate CREATE TABLE SQL", () => {
      blueprint.uuid("id");
      blueprint.string("name");
      blueprint.dateTime("created_at");
      blueprint.mergeTree();
      blueprint.orderBy("id");

      const sql = blueprint.toSql();
      expect(sql).toMatch(
        /CREATE TABLE IF NOT EXISTS test_table \(\s+id UUID,\s+name String,\s+created_at DateTime\s+\) ENGINE = MergeTree\s+ORDER BY \(id\);/
      );
    });

    it("should generate DROP TABLE SQL", () => {
      const sql = blueprint.toDropSql();
      expect(sql).toBe("DROP TABLE IF EXISTS test_table;");
    });
  });

  describe("altering tables", () => {
    it("should track column additions in alter mode", () => {
      const alterBlueprint = new Blueprint("test_table");
      alterBlueprint.setAltering(true);

      alterBlueprint.string("email").nullable().comment("User email");

      const alterSql = alterBlueprint.toAlterSql();
      expect(alterSql).toContain(
        "ALTER TABLE test_table ADD COLUMN email String"
      );
    });

    it("should track column modifications in alter mode", () => {
      const alterBlueprint = new Blueprint("test_table");
      alterBlueprint.setAltering(true);

      // First add a column then modify it (simulate existing column)
      alterBlueprint.string("name");

      // Then modify it with new definition
      alterBlueprint.string("name").comment("Updated definition");

      const alterSql = alterBlueprint.toAlterSql();
      expect(alterSql).toContain(
        "ALTER TABLE test_table ADD COLUMN name String"
      );
    });

    it("should track column drops in alter mode", () => {
      const alterBlueprint = new Blueprint("test_table");
      alterBlueprint.setAltering(true);

      alterBlueprint.dropColumn("old_column");

      const alterSql = alterBlueprint.toAlterSql();
      expect(alterSql).toContain(
        "ALTER TABLE test_table DROP COLUMN old_column"
      );
    });
  });

  describe("fluent interface", () => {
    it("should support direct chaining from column to table methods", () => {
      // This is the key use case: direct chaining from column to table methods
      blueprint
        .string("id")
        .nullable()
        .comment("Primary key")
        .mergeTree()
        .orderBy("id");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(1);
      expect(columns[0]).toEqual(
        expect.objectContaining({
          name: "id",
          type: "String",
          nullable: true,
          comment: "Primary key",
        })
      );

      const sql = blueprint.toSql();
      expect(sql).toContain("ENGINE = MergeTree");
      expect(sql).toContain("ORDER BY (id)");
    });

    it("should support multiple column definitions with table configuration", () => {
      blueprint.uuid("id").comment("Primary key");
      blueprint.string("name").nullable();
      blueprint.dateTime("created_at").default("now()");
      blueprint.mergeTree();
      blueprint.orderBy("id");

      const columns = blueprint.getColumns();
      expect(columns).toHaveLength(3);

      const sql = blueprint.toSql();
      expect(sql).toContain("id UUID");
      expect(sql).toContain("name String");
      expect(sql).toContain("created_at DateTime");
      expect(sql).toContain("ENGINE = MergeTree");
      expect(sql).toContain("ORDER BY (id)");
    });
  });
});
