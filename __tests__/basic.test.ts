import { ClickHouseConnection } from "../src/connection/ClickHouseConnection";

// Simple test to check if the library classes can be imported
describe("Basic Library Tests", () => {
  it("should be able to create a ClickHouseConnection instance", () => {
    const connection = new ClickHouseConnection({
      host: "localhost",
      port: 8123,
      database: "default",
      username: "default",
      password: "",
    });

    expect(connection).toBeInstanceOf(ClickHouseConnection);
  });

  it("should export expected methods on ClickHouseConnection", () => {
    const connection = new ClickHouseConnection({});

    // Check that key methods exist
    expect(typeof connection.query).toBe("function");
    expect(typeof connection.execute).toBe("function");
    expect(typeof connection.insert).toBe("function");
    expect(typeof connection.ping).toBe("function");
  });
});
