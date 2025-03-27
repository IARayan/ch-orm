/**
 * CH-ORM - A Developer-First ClickHouse ORM with Powerful CLI Tools
 * @package ch-orm
 */

// Connection exports
export { ClickHouseConnection } from "./connection/ClickHouseConnection";
export {
  ConnectionPool,
  ConnectionPoolOptions,
} from "./connection/ConnectionPool";

// Query builder exports
export { QueryBuilder } from "./query/QueryBuilder";
export { Raw } from "./query/Raw";

// Model exports
export { Model } from "./model/Model";

// Schema/Migration exports
export { Blueprint } from "./schema/Blueprint";
export { Migration } from "./schema/Migration";
export { Schema } from "./schema/Schema";

// Constants and enums
export * from "./constants/Types";

// CLI
export * from "./cli/commands";

// Relationships
export * from "./relationships/ModelRelationships";

// Decorators
export * from "./decorators/ModelDecorators";

// Types
export * from "./types/connection";

// Interfaces
export interface Seeder {
  run(): Promise<void>;
}
