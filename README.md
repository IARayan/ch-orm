<p align="center">
  <img src="logo.png" alt="CH-ORM Logo" width="250"/>
</p>

<h1 align="center">CH-ORM</h1>
<h3 align="center">A Developer-First ClickHouse ORM with Powerful CLI Tools</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/ch-orm"><img src="https://img.shields.io/npm/v/ch-orm.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/ch-orm"><img src="https://img.shields.io/npm/dm/ch-orm.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/iarayan/ch-orm/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/ch-orm.svg" alt="License" /></a>
  <a href="https://github.com/iarayan/ch-orm/actions"><img src="https://github.com/iarayan/ch-orm/actions/workflows/main.yml/badge.svg" alt="CI Status" /></a>
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
import { ClickHouseConnection, Model } from "ch-orm";

// Create a connection
const connection = new ClickHouseConnection({
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

// Use the pool for a specific operation
const result = await pool.withConnection(async (connection) => {
  // Set the connection temporarily
  Model.setConnection(connection);

  // Perform operations
  const users = await User.all();
  return users;
});
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
const result = await connection.query("SELECT * FROM users WHERE id = ?", [
  "1234",
]);

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

Creating tables with relationships:

```typescript
import { Migration, Blueprint } from "ch-orm";

export default class CreatePostsTable extends Migration {
  /**
   * Run the migration
   * Forward migration logic
   */
  public async up(): Promise<void> {
    // First, ensure the users table exists
    if (!(await this.schema.hasTable("users"))) {
      await this.schema.create("users", (table: Blueprint) => {
        table.uuid("id", { defaultExpression: "generateUUIDv4()" });
        table.string("name");
        table.string("email").unique();
        table.dateTime("created_at", { defaultExpression: "now()" });

        table.mergeTree();
        table.orderBy("id");
      });
    }

    // Create posts table with relationship to users
    await this.schema.create("posts", (table: Blueprint) => {
      // Define columns
      table.uuid("id", { defaultExpression: "generateUUIDv4()" });
      table.string("title");
      table.text("content");
      table.uuid("user_id"); // References users.id
      table.dateTime("created_at", { defaultExpression: "now()" });

      // Add indices for better join performance
      table.index("user_id_idx", "user_id");

      // ClickHouse specific settings
      table.mergeTree();
      table.orderBy(["id", "user_id"]); // Include user_id in ordering
      table.partitionBy("toYYYYMM(created_at)");

      // Using dictionary for fast lookups (optional)
      // This creates a dictionary for joining with the users table
      table.comment("Join using: posts JOIN users ON posts.user_id = users.id");
    });

    // Create a materialized view using the Schema class methods
    await this.schema.createMaterializedView(
      "posts_with_users",
      `
        SELECT
          p.*,
          u.name as user_name,
          u.email as user_email
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
      `,
      null,
      "MergeTree() ORDER BY (user_id, id) PARTITION BY toYYYYMM(created_at)"
    );
  }

  /**
   * Reverse the migration
   * Rollback migration logic
   */
  public async down(): Promise<void> {
    // Drop in reverse order
    await this.schema.dropMaterializedView("posts_with_users");
    await this.schema.drop("posts");
  }
}
```

You can also create regular views:

```typescript
import { Migration } from "ch-orm";

export default class CreateUserStatsView extends Migration {
  /**
   * Run the migration
   * Forward migration logic
   */
  public async up(): Promise<void> {
    // Create a regular view
    await this.schema.createView(
      "user_post_stats",
      `
        SELECT
          user_id,
          count() as post_count,
          min(created_at) as first_post_date,
          max(created_at) as last_post_date
        FROM posts
        GROUP BY user_id
      `
    );
  }

  /**
   * Reverse the migration
   * Rollback migration logic
   */
  public async down(): Promise<void> {
    await this.schema.dropView("user_post_stats");
  }
}
```

## 📖 Documentation

For complete documentation, visit our [GitHub Wiki](https://github.com/iarayan/ch-orm/wiki).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[MIT](LICENSE)
