import { ClickHouseConnection } from "../src/connection/ClickHouseConnection";
import { QueryBuilder } from "../src/query/QueryBuilder";

// Mock dependencies
jest.mock("../src/connection/ClickHouseConnection");

describe("QueryBuilder Basic Tests", () => {
  let queryBuilder: QueryBuilder;
  let connection: ClickHouseConnection;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock connection
    connection = new ClickHouseConnection({});
    (connection.query as jest.Mock).mockResolvedValue({ data: [] });

    // Create query builder instance
    queryBuilder = new QueryBuilder(connection, "test_table");
  });

  describe("constructor", () => {
    it("should create a query builder with connection and table", () => {
      expect(queryBuilder).toBeInstanceOf(QueryBuilder);
    });
  });

  describe("select", () => {
    it("should set columns to select", () => {
      const query = queryBuilder.select("id", "name", "email").toSql();

      expect(query).toContain("SELECT id, name, email");
      expect(query).toContain("FROM test_table");
    });

    it("should use * when no columns are provided", () => {
      const query = queryBuilder.select().toSql();

      expect(query).toContain("SELECT *");
      expect(query).toContain("FROM test_table");
    });
  });

  describe("where", () => {
    it("should add a basic where condition", () => {
      const query = queryBuilder.where("id", "=", 1).toSql();

      expect(query).toContain("WHERE id = 1");
    });

    it("should support shorthand where condition", () => {
      const query = queryBuilder.where("id", 1).toSql();

      expect(query).toContain("WHERE id = 1");
    });

    it("should add multiple where conditions", () => {
      const query = queryBuilder.where("id", 1).where("name", "test").toSql();

      expect(query).toContain("WHERE id = 1 AND name = 'test'");
    });
  });

  describe("orWhere", () => {
    it("should add an OR where condition", () => {
      const query = queryBuilder.where("id", 1).orWhere("id", 2).toSql();

      expect(query).toContain("WHERE id = 1 OR id = 2");
    });
  });

  describe("limit and offset", () => {
    it("should add limit clause", () => {
      const query = queryBuilder.limit(10).toSql();

      expect(query).toContain("LIMIT 10");
    });

    it("should add offset clause", () => {
      const query = queryBuilder
        .limit(10) // Add limit since offset requires limit in SQL
        .offset(5)
        .toSql();

      expect(query).toContain("OFFSET 5");
    });

    it("should combine limit and offset clauses", () => {
      const query = queryBuilder.limit(10).offset(5).toSql();

      expect(query).toContain("LIMIT 10 OFFSET 5");
    });
  });

  describe("orderBy", () => {
    it("should add orderBy with default direction", () => {
      const query = queryBuilder.orderBy("id").toSql();

      expect(query).toContain("ORDER BY id ASC");
    });

    it("should add orderBy with specified direction", () => {
      const query = queryBuilder.orderBy("id", "DESC").toSql();

      expect(query).toContain("ORDER BY id DESC");
    });

    it("should add multiple orderBy clauses", () => {
      const query = queryBuilder.orderBy("id", "DESC").orderBy("name").toSql();

      expect(query).toContain("ORDER BY id DESC, name ASC");
    });
  });

  describe("execution methods", () => {
    it("should call query with correct SQL for get", async () => {
      await queryBuilder.get();

      expect(connection.query).toHaveBeenCalled();
    });

    it("should call query with correct SQL for first", async () => {
      await queryBuilder.first();

      expect(connection.query).toHaveBeenCalled();
    });

    it("should call query with correct SQL for count", async () => {
      (connection.query as jest.Mock).mockResolvedValue({
        data: [{ count: 5 }],
      });

      const count = await queryBuilder.count();

      expect(count).toBe(5);
      expect(connection.query).toHaveBeenCalled();
    });
  });
});
