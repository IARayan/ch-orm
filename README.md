<p align="center">
  <img src="logo.png" alt="CH-ORM Logo" width="250"/>
</p>

<h1 align="center">CH-ORM</h1>
<h3 align="center">A Developer-First ClickHouse ORM with Powerful CLI Tools</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@iarayan/ch-orm"><img src="https://img.shields.io/npm/v/@iarayan/ch-orm.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@iarayan/ch-orm"><img src="https://img.shields.io/npm/dm/@iarayan/ch-orm.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/iarayan/ch-orm/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@iarayan/ch-orm.svg" alt="License" /></a>
  <a href="https://github.com/iarayan/ch-orm/actions"><img src="https://github.com/iarayan/ch-orm/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
</p>

<p align="center">
  <b>CH-ORM</b> is an elegant, Eloquent-style ORM for ClickHouse, designed to make working with ClickHouse analytics as simple as working with regular databases.
</p>

## 🚀 Features

- ✅ **Eloquent-style API** – Intuitive ORM for ClickHouse
- ✅ **Built-in CLI** – `chorm migrations`, `chorm models`, `chorm seeders`
- ✅ **Production-Ready** – Optimized for high-performance analytics
- ✅ **Seamless Migrations** – Schema migrations similar to Laravel/Rails
- ✅ **Modern TypeScript Support** – Strongly typed, DX-focused
- ✅ **Connection Pooling** – Efficient connection management
- ✅ **Query Builder** – Fluent, chainable query interface

## 📦 Installation

```bash
# Using npm
npm install @iarayan/ch-orm

# Using yarn
yarn add @iarayan/ch-orm

# Using pnpm
pnpm add @iarayan/ch-orm

# Global installation (for CLI access from anywhere)
npm install -g @iarayan/ch-orm
```

## 🔍 Quick Start

### Connection Setup

```typescript
import { Connection, Model } from "@iarayan/ch-orm";

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
import { ConnectionPool, Model } from "@iarayan/ch-orm";

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
import { Model, Table, Column, PrimaryKey } from "@iarayan/ch-orm";

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

// Basic query builder
const users = await User.query()
  .where("age", ">", 18)
  .orderBy("created_at", "DESC")
  .limit(10)
  .get();

// Raw queries with options
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
// Create and save in one step
const user = await User.createAndSave({
  name: "John Doe",
  email: "john@example.com",
});

// Create instance first, then save
const user = User.create({
  name: "John Doe",
  email: "john@example.com",
});
await user.save();

// Insert multiple records directly
await User.insert([
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Smith", email: "jane@example.com" },
]);

// Insert with query options
await User.createAndSave(
  {
    name: "John Doe",
    email: "john@example.com",
  },
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

## 🔄 Migrations

```typescript
import { Migration, Blueprint } from "@iarayan/ch-orm";

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

## 💡 Advanced Query Builder Features

```typescript
import { Raw } from "@iarayan/ch-orm";

// Complex where conditions with AND/OR
const users = await User.query()
  .where("status", "active")
  .where(function (query) {
    query.where("role", "admin").orWhere("role", "moderator");
  })
  .where("created_at", ">", new Date("2023-01-01"))
  .get();

// Raw expressions and functions
const popularPosts = await Post.query()
  .select("*", Raw.fn("COUNT", "*").as("view_count"))
  .where("created_at", ">", Raw.fn("subtractDays", Raw.now(), 7))
  .groupBy("id")
  .having("view_count", ">", 1000)
  .orderBy("view_count", "DESC")
  .limit(10)
  .get();

// Joins with conditions
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

// Raw SQL in where clauses
const customQuery = await User.query()
  .whereRaw("age > ? AND status = ?", [18, "active"])
  .orWhereRaw("role IN (?)", [["admin", "moderator"]])
  .get();

// Aggregation methods
const stats = await Post.query()
  .select(Raw.fn("COUNT", "*").as("total_posts"))
  .select(Raw.fn("SUM", "views").as("total_views"))
  .select(Raw.fn("AVG", "views").as("avg_views"))
  .first();

// FINAL modifier for latest version of rows
const latestUsers = await User.query().final().where("status", "active").get();

// SAMPLE modifier for approximate queries
const sampledUsers = await User.query()
  .sample(0.1) // 10% sample
  .where("status", "active")
  .get();
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[MIT](LICENSE)
