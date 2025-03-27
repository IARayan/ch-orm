# CH-ORM

A Developer-First ClickHouse ORM with Powerful CLI Tools

## Features

- ✅ **Eloquent-style API** – Intuitive Active Record ORM for ClickHouse
- ✅ **Built-in CLI** – `chorm migrations`, `chorm models`, `chorm seeders`
- ✅ **Production-Ready** – Optimized for high-performance analytics
- ✅ **Seamless Migrations** – Schema migrations similar to Laravel/Rails
- ✅ **Modern TypeScript Support** – Strongly typed, DX-focused
- ✅ **Connection Pooling** – Efficient connection management
- ✅ **Query Builder** – Fluent, chainable query interface

## Installation

```bash
npm install ch-orm
```

## Quick Start

### Connection Setup

```typescript
import { Connection, Model } from "ch-orm";

// Create a connection
const connection = new Connection({
  host: "localhost",
  port: 8123,
  database: "default",
  username: "default",
  password: "",
  protocol: "http", // or "https"
  timeout: 30000, // connection timeout in ms
  debug: false, // set to true to log queries
});

// Set the connection for all models
Model.setConnection(connection);
```

### Connection Pool (Recommended for Production)

```typescript
import { ConnectionPool, Model } from "ch-orm";

// Create a connection pool
const pool = new ConnectionPool(
  {
    host: "localhost",
    port: 8123,
    database: "default",
    username: "default",
    password: "",
    protocol: "http",
  },
  {
    minConnections: 2,
    maxConnections: 10,
    idleTimeoutMillis: 60000,
    acquireTimeoutMillis: 30000,
    validateOnBorrow: true,
  }
);

// Option 1: Use the pool for a specific operation
const result = await pool.withConnection(async (connection) => {
  return await connection.query("SELECT * FROM users");
});

// Option 2: Set the pool for all models
Model.setConnection(pool);
```

### Environment Configuration

CH-ORM will automatically load configuration from environment variables or a .env file:

```
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_DATABASE=default
CLICKHOUSE_USERNAME=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_PROTOCOL=http
CLICKHOUSE_DEBUG=false
CLICKHOUSE_MIGRATIONS_PATH=./migrations
CLICKHOUSE_MODELS_PATH=./models
CLICKHOUSE_SEEDERS_PATH=./seeders
```

### Defining Models

```typescript
import { Model, Table, Column, PrimaryKey } from "ch-orm";

@Table("users")
class User extends Model {
  @PrimaryKey()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: "DateTime", defaultExpression: "now()" })
  created_at: Date;
}
```

### Querying Data

```typescript
// Find by primary key
const user = await User.find("1234");

// Query builder
const users = await User.query()
  .where("age", ">", 18)
  .where(function (query) {
    query.where("role", "admin").orWhere("role", "moderator");
  })
  .orderBy("created_at", "DESC")
  .limit(10)
  .get();

// Raw queries
const result = await connection.query("SELECT * FROM users WHERE id = ?", [
  "1234",
]);

// Parameterized queries with options
const result = await connection.query(
  "SELECT * FROM users WHERE email = ?",
  ["user@example.com"],
  {
    format: "JSON",
    timeout_seconds: 30,
    max_rows_to_read: 1000,
    clickhouse_settings: {
      max_block_size: 100000,
      min_insert_block_size_rows: 1000,
    },
  }
);
```

### Creating Records

```typescript
// Create instance and save
const user = new User();
user.name = "John Doe";
user.email = "john@example.com";
await user.save();

// Create directly
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
});
```

## Migrations

```typescript
import { Migration, Blueprint } from "ch-orm";

export default class CreateUsersTable extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("users", (table: Blueprint) => {
      // Define columns
      table.uuid("id").default("generateUUIDv4()");
      table.string("name");
      table.string("email").unique();
      table.dateTime("created_at").default("now()");

      // Add an index
      table.index("email_idx", "email", "minmax", 3);

      // Set ClickHouse specific settings
      table.mergeTree(); // Set the engine to MergeTree
      table.orderBy("id"); // Define the primary key
      table.partitionBy("toYYYYMM(created_at)"); // Add partitioning

      // Add table settings
      table.tableSettings({
        index_granularity: 8192,
        storage_policy: "default",
      });
    });
  }

  public async down(): Promise<void> {
    await this.schema.drop("users");
  }
}
```

For altering existing tables:

```typescript
export default class AddProfileFieldsToUsers extends Migration {
  public async up(): Promise<void> {
    await this.schema.alter("users", (table: Blueprint) => {
      // Add new columns
      table.string("profile_picture");
      table.json("preferences");

      // Modify existing columns
      table.string("name", { nullable: false });
    });
  }

  public async down(): Promise<void> {
    await this.schema.alter("users", (table: Blueprint) => {
      // Reverse the changes
      table.dropColumn("profile_picture");
      table.dropColumn("preferences");
      table.string("name", { nullable: true });
    });
  }
}
```

## Advanced Query Builder Features

```typescript
import { Raw } from "ch-orm";

// Complex where conditions
const users = await User.query()
  .where("status", "active")
  .where(function (query) {
    query.where("role", "admin").orWhere("role", "moderator");
  })
  .where("created_at", ">", new Date("2023-01-01"))
  .get();

// Raw expressions
const popularPosts = await Post.query()
  .select("*", Raw.fn("COUNT", "*").as("view_count"))
  .where("created_at", ">", Raw.fn("subtractDays", Raw.now(), 7))
  .groupBy("id")
  .having("view_count", ">", 1000)
  .orderBy("view_count", "DESC")
  .limit(10)
  .get();

// Joins
const userStats = await User.query()
  .select(
    "users.id",
    "users.name",
    Raw.fn("COUNT", "posts.id").as("post_count")
  )
  .leftJoin("posts", "users.id", "=", "posts.user_id")
  .groupBy("users.id", "users.name")
  .get();

// WITH clauses (CTEs)
const result = await User.query()
  .with("active_users", User.query().where("status", "active"))
  .select("active_users.*")
  .from("active_users")
  .get();
```

## Writing Tests

```typescript
import { Connection, Model } from "ch-orm";

// Mock the ClickHouse Connection
jest.mock("ch-orm/lib/connection/Connection");

describe("User", () => {
  let connection: Connection;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create a mock connection
    connection = new Connection({});

    // Mock the query method
    (connection.query as jest.Mock).mockResolvedValue({
      data: [{ id: "1234", name: "Test User", email: "test@example.com" }],
    });

    // Set the mocked connection
    Model.setConnection(connection);
  });

  it("should fetch a user by ID", async () => {
    // Test your model method
    const user = await User.find("1234");

    // Verify the result
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Test User");
    expect(user?.email).toBe("test@example.com");

    // Verify that query was called with expected parameters
    expect(connection.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = ?"),
      expect.arrayContaining(["1234"])
    );
  });
});
```

## License

MIT
