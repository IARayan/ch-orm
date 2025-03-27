<p align="center">
  <img src="logo.png" alt="CH-ORM Logo" width="250"/>
</p>

<h1 align="center">CH-ORM</h1>
<h3 align="center">A Developer-First ClickHouse ORM with Powerful CLI Tools</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@iarayan/ch-orm"><img src="https://img.shields.io/npm/v/ch-orm.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@iarayan/ch-orm"><img src="https://img.shields.io/npm/dm/ch-orm.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/iarayan/ch-orm/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/ch-orm.svg" alt="License" /></a>
  <a href="https://github.com/iarayan/ch-orm/actions"><img src="https://github.com/iarayan/ch-orm/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
</p>

<p align="center">
  <b>CH-ORM</b> is an elegant, Eloquent-style ORM for ClickHouse, designed to make working with ClickHouse analytics as simple as working with regular databases.
</p>

## 🚀 Features

- ✅ **Eloquent-style API** – Intuitive Active Record ORM for ClickHouse
- ✅ **Built-in CLI** – `chorm migrations`, `chorm models`, `chorm seeders`
- ✅ **Production-Ready** – Optimized for high-performance analytics
- ✅ **Seamless Migrations** – Schema migrations similar to Laravel/Rails
- ✅ **Modern TypeScript Support** – Strongly typed, DX-focused
- ✅ **Connection Pooling** – Efficient connection management
- ✅ **Relationship Support** – One-to-One, One-to-Many, Many-to-Many
- ✅ **Query Builder** – Fluent, chainable query interface

## 📦 Installation

```bash
# Using npm
npm install ch-orm

# Using yarn
yarn add ch-orm

# Using pnpm
pnpm add ch-orm

# Global installation (for CLI access from anywhere)
npm install -g ch-orm
```

## 🔍 Quick Start

### Connection Setup

The first step is to create a connection to your ClickHouse database and set it for your models:

```typescript
import { Connection, Model } from "ch-orm";

// Create a connection
const connection = new Connection({
  host: "localhost",
  port: 8123,
  database: "default",
  username: "default",
  password: "",
  debug: false, // Set to true to log queries
});

// IMPORTANT: Set the connection for all models to use
Model.setConnection(connection);
```

### Connection Pool (Recommended for Production)

For production environments, use a connection pool:

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
  // Perform operations with the connection
  const result = await connection.query("SELECT * FROM users");
  return result;
});

// Option 2: Set the pool directly for all models
// This will handle connection pooling automatically
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
import { Model, Table, Column, PrimaryKey, DateTimeColumn } from "ch-orm";

@Table("users")
class User extends Model {
  @PrimaryKey()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @DateTimeColumn({ defaultExpression: "now()" })
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
  .orderBy("created_at", "DESC")
  .limit(10)
  .get();

// Raw queries
const result = await connection.query("SELECT * FROM users WHERE id = 1234");

// Parameterized queries
const result = await connection.execute("SELECT * FROM users WHERE email = ?", [
  "user@example.com",
]);
```

### Creating Records

```typescript
// Create instance and save
const user = new User();
user.name = "John Doe";
user.email = "john@example.com";
await user.save();

// Create directly
const user = await User.createAndSave({
  name: "John Doe",
  email: "john@example.com",
});
```

### Working with Relationships

```typescript
import { Model, Table, Column, HasMany, BelongsTo } from "ch-orm";

@Table("posts")
class Post extends Model {
  @PrimaryKey()
  id: string;

  @Column()
  title: string;

  @Column()
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user() {
    return this.belongsTo(User, "user_id");
  }
}

@Table("users")
class User extends Model {
  @PrimaryKey()
  id: string;

  @Column()
  name: string;

  @HasMany(() => Post, "user_id")
  posts() {
    return this.hasMany(Post, "user_id");
  }
}

// Using relationships
const user = await User.find("1234");
const posts = await user.posts().get();

const post = await Post.find("5678");
const author = await post.user().first();
```

## 🛠️ CLI Tools

CH-ORM includes a powerful CLI for managing migrations, models and seeders:

```bash
# Migrations
chorm migrations create <name>     # Create a new migration file
chorm migrations run               # Run all pending migrations
chorm migrations rollback          # Rollback the last batch of migrations
chorm migrations status            # Show migration status
chorm migrations reset             # Rollback all migrations
chorm migrations fresh             # Drop all tables and re-run migrations

# Models
chorm models create <name>         # Create a new model file

# Seeders
chorm seeders create <name>        # Create a new seeder file
chorm seeders run                  # Run database seeders
```

## 🔄 Migrations

```typescript
import { Migration, Blueprint } from "ch-orm";

export default class CreateUsersTable extends Migration {
  /**
   * Run the migration
   * Forward migration logic
   */
  public async up(): Promise<void> {
    await this.schema.create("users", (table: Blueprint) => {
      // Define columns
      table.uuid("id", { defaultExpression: "generateUUIDv4()" });
      table.string("name");
      table.string("email").unique();
      table.dateTime("created_at", { defaultExpression: "now()" });

      // Add an index
      table.index("email_idx", "email", "minmax", 3);

      // Set ClickHouse specific settings
      table.mergeTree(); // Set the engine to MergeTree
      table.orderBy("id"); // Define the primary key
      table.partitionBy("toYYYYMM(created_at)"); // Add partitioning

      // Add table settings if needed
      table.tableSettings({
        index_granularity: 8192,
        storage_policy: "default",
      });
    });
  }

  /**
   * Reverse the migration
   * Rollback migration logic
   */
  public async down(): Promise<void> {
    await this.schema.drop("users");
  }
}
```

For altering existing tables:

```typescript
import { Migration, Blueprint } from "ch-orm";

export default class AddProfileFieldsToUsers extends Migration {
  /**
   * Run the migration
   * Forward migration logic
   */
  public async up(): Promise<void> {
    await this.schema.alter("users", (table: Blueprint) => {
      // Add new columns
      table.string("profile_picture");
      table.json("preferences");

      // Modify existing columns
      table.string("name", { nullable: false });
    });
  }

  /**
   * Reverse the migration
   * Rollback migration logic
   */
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

The QueryBuilder provides a fluent interface for constructing complex queries:

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
```

## 🧪 Writing Tests

Test your CH-ORM code with mocked connections:

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

## 📖 Documentation

For complete documentation, visit our [GitHub Wiki](https://github.com/iarayan/ch-orm/wiki).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[MIT](LICENSE)
