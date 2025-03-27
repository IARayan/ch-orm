import { Blueprint } from "../schema/Blueprint";

// Create a table blueprint
const table = new Blueprint("users");

// Example 1: Using the new fluent interface
table.string("id").nullable().comment("User identifier");
table.string("username").comment("User's username");
table.string("email").nullable().comment("User's email address");
table.dateTime64("created_at", 3, "UTC").comment("Creation timestamp");
table
  .boolean("is_active")
  .default("1")
  .comment("Flag indicating if user is active");

// Example 2: Using the original object-options interface
table.string("address", { nullable: true, comment: "User's address" });

// Example 3: Using register() explicitly to chain back to Blueprint methods
table
  .string("status")
  .comment("User status")
  .default("'active'")
  .register()
  .orderBy("id") // This now chains to Blueprint methods
  .partitionBy("toYYYYMM(created_at)");

// Example 4: Using implicit registration (no need for register() call)
table
  .string("last_seen")
  .nullable()
  .comment("Last time user was seen")
  .orderBy(["id", "created_at"]) // Implicitly registers the column and continues with Blueprint methods
  .tableSettings({ index_granularity: 8192 });

// Configure table
table.mergeTree().comment("Table containing user information");

// Generate SQL
console.log(table.toSql());

// Example of altering a table
const alterTable = new Blueprint("users");
alterTable.setAltering(true);

// Add columns in fluent style
alterTable.string("phone").nullable().comment("User's phone number");

// Modify columns in fluent style
alterTable.string("email").comment("User's verified email address");

// Example of a complete chain from column to table operations with implicit registration
alterTable
  .string("last_login")
  .nullable()
  .comment("User's last login timestamp")
  .dropColumn("some_old_column"); // Implicitly registers the column and continues with Blueprint methods

// Generate ALTER SQL
console.log(alterTable.toAlterSql());
