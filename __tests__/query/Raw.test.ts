import { Raw } from "../../src/query/Raw";

describe("Raw", () => {
  describe("constructor", () => {
    it("should create a Raw instance with a value", () => {
      const raw = new Raw("SELECT * FROM users");
      expect(raw).toBeInstanceOf(Raw);
      expect(raw.toString()).toBe("SELECT * FROM users");
    });
  });

  describe("toString", () => {
    it("should return the raw SQL value", () => {
      const raw = new Raw("SELECT * FROM users");
      expect(raw.toString()).toBe("SELECT * FROM users");
    });
  });

  describe("toSql", () => {
    it("should return the raw SQL value", () => {
      const raw = new Raw("SELECT * FROM users");
      expect(raw.toSql()).toBe("SELECT * FROM users");
    });
  });

  describe("static make", () => {
    it("should create a Raw instance with a value", () => {
      const raw = Raw.make("SELECT * FROM users");
      expect(raw).toBeInstanceOf(Raw);
      expect(raw.toString()).toBe("SELECT * FROM users");
    });

    it("should be usable in query conditions", () => {
      const raw = Raw.make("id = 1 OR name = 'John'");
      expect(raw.toString()).toBe("id = 1 OR name = 'John'");
    });
  });

  describe("static column", () => {
    it("should create a Raw instance with a quoted column name", () => {
      const raw = Raw.column("name");
      expect(raw.toString()).toBe("`name`");
    });

    it("should handle table.column format", () => {
      const raw = Raw.column("users.name");
      expect(raw.toString()).toBe("`users`.`name`");
    });
  });

  describe("static table", () => {
    it("should create a Raw instance with a quoted table name", () => {
      const raw = Raw.table("users");
      expect(raw.toString()).toBe("`users`");
    });

    it("should handle database.table format", () => {
      const raw = Raw.table("mydb.users");
      expect(raw.toString()).toBe("`mydb`.`users`");
    });
  });

  describe("static now", () => {
    it("should create a Raw instance for the now() function", () => {
      const raw = Raw.now();
      expect(raw.toString()).toBe("now()");
    });
  });

  describe("static today", () => {
    it("should create a Raw instance for the today() function", () => {
      const raw = Raw.today();
      expect(raw.toString()).toBe("today()");
    });
  });

  describe("static fn", () => {
    it("should create a Raw instance for a function call", () => {
      const raw = Raw.fn("COUNT", "*");
      expect(raw.toString()).toBe("COUNT('*')");
    });

    it("should handle multiple parameters", () => {
      const raw = Raw.fn("CAST", "2023-01-01", "DateTime");
      expect(raw.toString()).toBe("CAST('2023-01-01', 'DateTime')");
    });

    it("should handle Raw parameters", () => {
      const columnRaw = Raw.column("created_at");
      const raw = Raw.fn("toStartOfDay", columnRaw);
      expect(raw.toString()).toBe("toStartOfDay(`created_at`)");
    });
  });
});
