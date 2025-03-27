import { Connection } from "../src/connection/Connection";

// Simple test to check if the library classes can be imported
describe("Basic Library Tests", () => {
  it("should be able to create a Connection instance", () => {
    const connection = new Connection({
      host: "localhost",
      port: 8123,
      database: "default",
      username: "default",
      password: "",
    });

    expect(connection).toBeInstanceOf(Connection);
  });

  it("should export expected methods on Connection", () => {
    const connection = new Connection({});

    // Check that key methods exist
    expect(typeof connection.query).toBe("function");
    expect(typeof connection.execute).toBe("function");
    expect(typeof connection.insert).toBe("function");
    expect(typeof connection.ping).toBe("function");
  });
});
