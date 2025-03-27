import { Connection } from "../connection/Connection";
import { QueryOptions, QueryResult } from "../types/connection";
import { formatValue } from "../utils/helpers";
import { Raw } from "./Raw";

/**
 * Type for where clause conditions
 */
type WhereCondition = {
  column: string | Raw;
  operator: string;
  value: any;
  boolean: "AND" | "OR";
  not?: boolean;
};

/**
 * Type for order by clauses
 */
type OrderByClause = {
  column: string | Raw;
  direction: "ASC" | "DESC";
};

/**
 * Type for join clauses
 */
type JoinClause = {
  table: string;
  type: "INNER" | "LEFT" | "RIGHT" | "FULL" | "CROSS" | "ANY" | "ALL";
  conditions: {
    first: string | Raw;
    operator: string;
    second: string | Raw;
    boolean: "AND" | "OR";
  }[];
};

/**
 * Query builder class for constructing SQL queries with a fluent interface
 * Provides an Eloquent-like query building experience
 */
export class QueryBuilder {
  /**
   * Database connection instance
   */
  protected connection: Connection;

  /**
   * Table name to query
   */
  protected tableName: string = "";

  /**
   * Query type (SELECT, INSERT, UPDATE, DELETE)
   */
  protected queryType: "SELECT" | "INSERT" | "UPDATE" | "DELETE" = "SELECT";

  /**
   * Columns to select
   */
  protected columns: (string | Raw)[] = ["*"];

  /**
   * Where conditions
   */
  protected wheres: WhereCondition[] = [];

  /**
   * Having conditions
   */
  protected havings: WhereCondition[] = [];

  /**
   * Order by clauses
   */
  protected orders: OrderByClause[] = [];

  /**
   * Group by columns
   */
  protected groups: (string | Raw)[] = [];

  /**
   * Join clauses
   */
  protected joins: JoinClause[] = [];

  /**
   * Limit value
   */
  protected limitValue: number | null = null;

  /**
   * Offset value
   */
  protected offsetValue: number | null = null;

  /**
   * FINAL modifier flag
   */
  protected finalFlag: boolean = false;

  /**
   * Sample rate value
   */
  protected sampleRate: number | null = null;

  /**
   * Values for INSERT
   */
  protected insertValues: Record<string, any>[] = [];

  /**
   * Values for UPDATE
   */
  protected updateValues: Record<string, any> = {};

  /**
   * WITH clause expressions
   */
  protected withExpressions: { name: string; query: QueryBuilder | Raw }[] = [];

  /**
   * Create a new QueryBuilder instance
   * @param connection - ClickHouse connection
   * @param table - Table name (optional)
   */
  constructor(connection: Connection, table?: string) {
    this.connection = connection;

    if (table) {
      this.from(table);
    }
  }

  /**
   * Set the table to query
   * @param table - Table name
   * @returns QueryBuilder instance for chaining
   */
  public from(table: string): this {
    this.tableName = table;
    return this;
  }

  /**
   * Set the table to query
   * @param table - Table name
   * @returns QueryBuilder instance for chaining
   */
  public table(table: string): this {
    return this.from(table);
  }

  /**
   * Add a FINAL modifier to the query
   * @returns QueryBuilder instance for chaining
   */
  public final(): this {
    this.finalFlag = true;
    return this;
  }

  /**
   * Add a SAMPLE modifier to the query
   * @param rate - Sample rate (0.0 to 1.0)
   * @returns QueryBuilder instance for chaining
   */
  public sample(rate: number): this {
    if (rate < 0 || rate > 1) {
      throw new Error("Sample rate must be between 0 and 1");
    }

    this.sampleRate = rate;
    return this;
  }

  /**
   * Set the columns to select
   * @param columns - Column names or Raw expressions
   * @returns QueryBuilder instance for chaining
   */
  public select(...columns: (string | Raw)[]): this {
    this.queryType = "SELECT";
    this.columns = columns.length ? columns : ["*"];
    return this;
  }

  /**
   * Add a where clause
   * @param column - Column name or Raw expression
   * @param operator - Comparison operator or value if operator is omitted
   * @param value - Value to compare (optional if operator is actually the value)
   * @returns QueryBuilder instance for chaining
   */
  public where(
    column: string | Raw | Record<string, any>,
    operator?: string | any,
    value?: any
  ): this {
    // Handle object style where clauses: where({ name: 'John', age: 30 })
    if (typeof column === "object" && !(column instanceof Raw)) {
      Object.entries(column).forEach(([key, val]) => {
        this.where(key, "=", val);
      });

      return this;
    }

    // Handle where(column, value) shorthand
    if (arguments.length === 2) {
      value = operator;
      operator = "=";
    }

    this.wheres.push({
      column,
      operator: operator as string,
      value,
      boolean: "AND",
    });

    return this;
  }

  /**
   * Add an OR where clause
   * @param column - Column name or Raw expression
   * @param operator - Comparison operator or value if operator is omitted
   * @param value - Value to compare (optional if operator is actually the value)
   * @returns QueryBuilder instance for chaining
   */
  public orWhere(
    column: string | Raw | Record<string, any>,
    operator?: string | any,
    value?: any
  ): this {
    // Handle object style where clauses: orWhere({ name: 'John', age: 30 })
    if (typeof column === "object" && !(column instanceof Raw)) {
      const keys = Object.keys(column);

      // Handle first entry separately
      if (keys.length > 0) {
        const key = keys[0];
        this.orWhere(key, "=", column[key]);

        // Handle remaining entries with AND
        keys.slice(1).forEach((key) => {
          this.where(key, "=", column[key]);
        });
      }

      return this;
    }

    // Handle orWhere(column, value) shorthand
    if (arguments.length === 2) {
      value = operator;
      operator = "=";
    }

    this.wheres.push({
      column,
      operator: operator as string,
      value,
      boolean: "OR",
    });

    return this;
  }

  /**
   * Add a where not clause
   * @param column - Column name or Raw expression
   * @param operator - Comparison operator or value if operator is omitted
   * @param value - Value to compare (optional if operator is actually the value)
   * @returns QueryBuilder instance for chaining
   */
  public whereNot(
    column: string | Raw,
    operator?: string | any,
    value?: any
  ): this {
    // Handle whereNot(column, value) shorthand
    if (arguments.length === 2) {
      value = operator;
      operator = "=";
    }

    this.wheres.push({
      column,
      operator: operator as string,
      value,
      boolean: "AND",
      not: true,
    });

    return this;
  }

  /**
   * Add a where in clause
   * @param column - Column name or Raw expression
   * @param values - Array of values to check against
   * @returns QueryBuilder instance for chaining
   */
  public whereIn(column: string | Raw, values: any[]): this {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("whereIn requires a non-empty array of values");
    }

    this.wheres.push({
      column,
      operator: "IN",
      value: values,
      boolean: "AND",
    });

    return this;
  }

  /**
   * Add an or where in clause
   * @param column - Column name or Raw expression
   * @param values - Array of values to check against
   * @returns QueryBuilder instance for chaining
   */
  public orWhereIn(column: string | Raw, values: any[]): this {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("orWhereIn requires a non-empty array of values");
    }

    this.wheres.push({
      column,
      operator: "IN",
      value: values,
      boolean: "OR",
    });

    return this;
  }

  /**
   * Add a where not in clause
   * @param column - Column name or Raw expression
   * @param values - Array of values to check against
   * @returns QueryBuilder instance for chaining
   */
  public whereNotIn(column: string | Raw, values: any[]): this {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("whereNotIn requires a non-empty array of values");
    }

    this.wheres.push({
      column,
      operator: "IN",
      value: values,
      boolean: "AND",
      not: true,
    });

    return this;
  }

  /**
   * Add a where between clause
   * @param column - Column name or Raw expression
   * @param values - Array of two values [min, max]
   * @returns QueryBuilder instance for chaining
   */
  public whereBetween(column: string | Raw, values: [any, any]): this {
    if (!Array.isArray(values) || values.length !== 2) {
      throw new Error("whereBetween requires an array of exactly two values");
    }

    this.wheres.push({
      column,
      operator: "BETWEEN",
      value: values,
      boolean: "AND",
    });

    return this;
  }

  /**
   * Add a where not between clause
   * @param column - Column name or Raw expression
   * @param values - Array of two values [min, max]
   * @returns QueryBuilder instance for chaining
   */
  public whereNotBetween(column: string | Raw, values: [any, any]): this {
    if (!Array.isArray(values) || values.length !== 2) {
      throw new Error(
        "whereNotBetween requires an array of exactly two values"
      );
    }

    this.wheres.push({
      column,
      operator: "BETWEEN",
      value: values,
      boolean: "AND",
      not: true,
    });

    return this;
  }

  /**
   * Add a where null clause
   * @param column - Column name or Raw expression
   * @returns QueryBuilder instance for chaining
   */
  public whereNull(column: string | Raw): this {
    this.wheres.push({
      column,
      operator: "IS",
      value: null,
      boolean: "AND",
    });

    return this;
  }

  /**
   * Add a where not null clause
   * @param column - Column name or Raw expression
   * @returns QueryBuilder instance for chaining
   */
  public whereNotNull(column: string | Raw): this {
    this.wheres.push({
      column,
      operator: "IS",
      value: null,
      boolean: "AND",
      not: true,
    });

    return this;
  }

  /**
   * Add a raw where clause
   * @param sql - Raw SQL for where clause
   * @param bindings - Parameter bindings for the SQL
   * @returns QueryBuilder instance for chaining
   */
  public whereRaw(sql: string, bindings: any[] = []): this {
    // Process bindings
    let processedSql = sql;
    bindings.forEach((binding) => {
      processedSql = processedSql.replace("?", formatValue(binding));
    });

    this.wheres.push({
      column: new Raw(processedSql),
      operator: "",
      value: null,
      boolean: "AND",
    });

    return this;
  }

  /**
   * Add a raw or where clause
   * @param sql - Raw SQL for where clause
   * @param bindings - Parameter bindings for the SQL
   * @returns QueryBuilder instance for chaining
   */
  public orWhereRaw(sql: string, bindings: any[] = []): this {
    // Process bindings
    let processedSql = sql;
    bindings.forEach((binding) => {
      processedSql = processedSql.replace("?", formatValue(binding));
    });

    this.wheres.push({
      column: new Raw(processedSql),
      operator: "",
      value: null,
      boolean: "OR",
    });

    return this;
  }

  /**
   * Add an inner join clause
   * @param table - Table to join
   * @param first - First column or a callback function
   * @param operator - Comparison operator
   * @param second - Second column
   * @returns QueryBuilder instance for chaining
   */
  public join(
    table: string,
    first: string | Raw | ((join: JoinClause) => void),
    operator?: string,
    second?: string | Raw
  ): this {
    return this.joinWithType("INNER", table, first, operator, second);
  }

  /**
   * Add a left join clause
   * @param table - Table to join
   * @param first - First column or a callback function
   * @param operator - Comparison operator
   * @param second - Second column
   * @returns QueryBuilder instance for chaining
   */
  public leftJoin(
    table: string,
    first: string | Raw | ((join: JoinClause) => void),
    operator?: string,
    second?: string | Raw
  ): this {
    return this.joinWithType("LEFT", table, first, operator, second);
  }

  /**
   * Add a right join clause
   * @param table - Table to join
   * @param first - First column or a callback function
   * @param operator - Comparison operator
   * @param second - Second column
   * @returns QueryBuilder instance for chaining
   */
  public rightJoin(
    table: string,
    first: string | Raw | ((join: JoinClause) => void),
    operator?: string,
    second?: string | Raw
  ): this {
    return this.joinWithType("RIGHT", table, first, operator, second);
  }

  /**
   * Add a full join clause
   * @param table - Table to join
   * @param first - First column or a callback function
   * @param operator - Comparison operator
   * @param second - Second column
   * @returns QueryBuilder instance for chaining
   */
  public fullJoin(
    table: string,
    first: string | Raw | ((join: JoinClause) => void),
    operator?: string,
    second?: string | Raw
  ): this {
    return this.joinWithType("FULL", table, first, operator, second);
  }

  /**
   * Add a cross join clause
   * @param table - Table to join
   * @returns QueryBuilder instance for chaining
   */
  public crossJoin(table: string): this {
    this.joins.push({
      table,
      type: "CROSS",
      conditions: [],
    });

    return this;
  }

  /**
   * Helper method for adding join clauses of different types
   * @param type - Join type
   * @param table - Table to join
   * @param first - First column or a callback function
   * @param operator - Comparison operator
   * @param second - Second column
   * @returns QueryBuilder instance for chaining
   */
  private joinWithType(
    type: "INNER" | "LEFT" | "RIGHT" | "FULL" | "CROSS" | "ANY" | "ALL",
    table: string,
    first: string | Raw | ((join: JoinClause) => void),
    operator?: string,
    second?: string | Raw
  ): this {
    const join: JoinClause = {
      table,
      type,
      conditions: [],
    };

    // If first is a function, it's a join callback
    if (typeof first === "function") {
      first(join);
    } else if (
      first !== undefined &&
      operator !== undefined &&
      second !== undefined
    ) {
      join.conditions.push({
        first,
        operator,
        second,
        boolean: "AND",
      });
    }

    this.joins.push(join);
    return this;
  }

  /**
   * Add a group by clause
   * @param columns - Columns to group by
   * @returns QueryBuilder instance for chaining
   */
  public groupBy(...columns: (string | Raw)[]): this {
    this.groups = [...this.groups, ...columns];
    return this;
  }

  /**
   * Add a having clause
   * @param column - Column name or Raw expression
   * @param operator - Comparison operator or value if operator is omitted
   * @param value - Value to compare (optional if operator is actually the value)
   * @returns QueryBuilder instance for chaining
   */
  public having(
    column: string | Raw,
    operator?: string | any,
    value?: any
  ): this {
    // Handle having(column, value) shorthand
    if (arguments.length === 2) {
      value = operator;
      operator = "=";
    }

    this.havings.push({
      column,
      operator: operator as string,
      value,
      boolean: "AND",
    });

    return this;
  }

  /**
   * Add an or having clause
   * @param column - Column name or Raw expression
   * @param operator - Comparison operator or value if operator is omitted
   * @param value - Value to compare (optional if operator is actually the value)
   * @returns QueryBuilder instance for chaining
   */
  public orHaving(
    column: string | Raw,
    operator?: string | any,
    value?: any
  ): this {
    // Handle orHaving(column, value) shorthand
    if (arguments.length === 2) {
      value = operator;
      operator = "=";
    }

    this.havings.push({
      column,
      operator: operator as string,
      value,
      boolean: "OR",
    });

    return this;
  }

  /**
   * Add an order by clause
   * @param column - Column to order by
   * @param direction - Direction (ASC or DESC)
   * @returns QueryBuilder instance for chaining
   */
  public orderBy(
    column: string | Raw,
    direction: "ASC" | "DESC" = "ASC"
  ): this {
    this.orders.push({
      column,
      direction,
    });

    return this;
  }

  /**
   * Add an order by desc clause
   * @param column - Column to order by
   * @returns QueryBuilder instance for chaining
   */
  public orderByDesc(column: string | Raw): this {
    return this.orderBy(column, "DESC");
  }

  /**
   * Set the limit value
   * @param value - Limit value
   * @returns QueryBuilder instance for chaining
   */
  public limit(value: number): this {
    this.limitValue = value;
    return this;
  }

  /**
   * Set the offset value
   * @param value - Offset value
   * @returns QueryBuilder instance for chaining
   */
  public offset(value: number): this {
    this.offsetValue = value;
    return this;
  }

  /**
   * Add a with clause
   * @param name - CTE name
   * @param query - Query builder instance or Raw expression
   * @returns QueryBuilder instance for chaining
   */
  public with(name: string, query: QueryBuilder | Raw): this {
    this.withExpressions.push({ name, query });
    return this;
  }

  /**
   * Set insert values
   * @param values - Values to insert
   * @returns QueryBuilder instance for chaining
   */
  public values(values: Record<string, any> | Record<string, any>[]): this {
    this.queryType = "INSERT";

    if (Array.isArray(values)) {
      this.insertValues = values;
    } else {
      this.insertValues = [values];
    }

    return this;
  }

  /**
   * Set update values
   * @param values - Values to update
   * @returns QueryBuilder instance for chaining
   */
  public updateQuery(values: Record<string, any>): this {
    this.queryType = "UPDATE";
    this.updateValues = values;
    return this;
  }

  /**
   * Set query type to DELETE
   * @returns QueryBuilder instance for chaining
   */
  public deleteQuery(): this {
    this.queryType = "DELETE";
    return this;
  }

  /**
   * Build the SQL query string
   * @returns SQL query string
   */
  public toSql(): string {
    // Build appropriate query based on type
    switch (this.queryType) {
      case "SELECT":
        return this.buildSelectQuery();
      case "INSERT":
        return this.buildInsertQuery();
      case "UPDATE":
        return this.buildUpdateQuery();
      case "DELETE":
        return this.buildDeleteQuery();
      default:
        throw new Error(`Unsupported query type: ${this.queryType}`);
    }
  }

  /**
   * Build a SELECT query
   * @returns SQL query string
   */
  protected buildSelectQuery(): string {
    if (!this.tableName) {
      throw new Error("No table specified for select query");
    }

    // Parts of the query
    const parts: string[] = [];

    // Add WITH clause if needed
    if (this.withExpressions.length > 0) {
      const withClauses = this.withExpressions
        .map(({ name, query }) => {
          const sql = query instanceof Raw ? query.toSql() : query.toSql();
          return `${name} AS (${sql})`;
        })
        .join(", ");

      parts.push(`WITH ${withClauses}`);
    }

    // Add SELECT clause
    const columns = this.columns
      .map((column) => {
        return column instanceof Raw ? column.toSql() : column;
      })
      .join(", ");

    parts.push(`SELECT ${columns}`);

    // Add FROM clause
    let from = this.tableName;

    // Add FINAL modifier if needed
    if (this.finalFlag) {
      from += " FINAL";
    }

    // Add SAMPLE modifier if needed
    if (this.sampleRate !== null) {
      from += ` SAMPLE ${this.sampleRate}`;
    }

    parts.push(`FROM ${from}`);

    // Add JOIN clauses
    if (this.joins.length > 0) {
      const joinClauses = this.joins
        .map((join) => {
          let clause = `${join.type} JOIN ${join.table}`;

          // Add ON conditions if any
          if (join.conditions.length > 0) {
            const conditions = join.conditions
              .map((condition, index) => {
                const { first, operator, second, boolean } = condition;
                const firstCol = first instanceof Raw ? first.toSql() : first;
                const secondCol =
                  second instanceof Raw ? second.toSql() : second;
                const booleanOperator = index === 0 ? "" : ` ${boolean}`;

                return `${booleanOperator} ${firstCol} ${operator} ${secondCol}`;
              })
              .join(" ");

            clause += ` ON ${conditions.trim()}`;
          }

          return clause;
        })
        .join(" ");

      parts.push(joinClauses);
    }

    // Add WHERE clause
    if (this.wheres.length > 0) {
      const whereClauses = this.wheres
        .map((where, index) => {
          const { column, operator, value, boolean, not } = where;
          const booleanOperator = index === 0 ? "" : ` ${boolean}`;
          const notOperator = not ? " NOT" : "";

          // Handle raw where clauses
          if (column instanceof Raw && operator === "") {
            return `${booleanOperator}${notOperator} ${column.toSql()}`;
          }

          const columnStr = column instanceof Raw ? column.toSql() : column;

          // Handle different operators
          switch (operator) {
            case "IN":
              if (!Array.isArray(value) || value.length === 0) {
                throw new Error(
                  "IN operator requires a non-empty array of values"
                );
              }

              const formattedValues = value
                .map((val) => formatValue(val))
                .join(", ");
              return `${booleanOperator}${notOperator} ${columnStr} IN (${formattedValues})`;

            case "BETWEEN":
              if (!Array.isArray(value) || value.length !== 2) {
                throw new Error(
                  "BETWEEN operator requires an array of exactly two values"
                );
              }

              return `${booleanOperator}${notOperator} ${columnStr} BETWEEN ${formatValue(
                value[0]
              )} AND ${formatValue(value[1])}`;

            case "IS":
              return `${booleanOperator} ${columnStr} IS${notOperator} NULL`;

            default:
              return `${booleanOperator}${notOperator} ${columnStr} ${operator} ${formatValue(
                value
              )}`;
          }
        })
        .join("");

      parts.push(`WHERE ${whereClauses.trim()}`);
    }

    // Add GROUP BY clause
    if (this.groups.length > 0) {
      const groupClauses = this.groups
        .map((group) => {
          return group instanceof Raw ? group.toSql() : group;
        })
        .join(", ");

      parts.push(`GROUP BY ${groupClauses}`);
    }

    // Add HAVING clause
    if (this.havings.length > 0) {
      const havingClauses = this.havings
        .map((having, index) => {
          const { column, operator, value, boolean } = having;
          const booleanOperator = index === 0 ? "" : ` ${boolean}`;
          const columnStr = column instanceof Raw ? column.toSql() : column;

          return `${booleanOperator} ${columnStr} ${operator} ${formatValue(
            value
          )}`;
        })
        .join("");

      parts.push(`HAVING ${havingClauses.trim()}`);
    }

    // Add ORDER BY clause
    if (this.orders.length > 0) {
      const orderClauses = this.orders
        .map((order) => {
          const columnStr =
            order.column instanceof Raw ? order.column.toSql() : order.column;
          return `${columnStr} ${order.direction}`;
        })
        .join(", ");

      parts.push(`ORDER BY ${orderClauses}`);
    }

    // Add LIMIT and OFFSET clauses
    if (this.limitValue !== null) {
      parts.push(`LIMIT ${this.limitValue}`);

      if (this.offsetValue !== null) {
        parts.push(`OFFSET ${this.offsetValue}`);
      }
    }

    return parts.join(" ");
  }

  /**
   * Build an INSERT query
   * @returns SQL query string
   */
  protected buildInsertQuery(): string {
    if (!this.tableName) {
      throw new Error("No table specified for insert query");
    }

    if (this.insertValues.length === 0) {
      throw new Error("No values specified for insert query");
    }

    // Get columns from the first row
    const columns = Object.keys(this.insertValues[0]);

    if (columns.length === 0) {
      throw new Error("No columns found in insert data");
    }

    // Build the insert query
    let sql = `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES `;

    // Add values for each row
    const values = this.insertValues
      .map((row) => {
        const rowValues = columns.map((column) => formatValue(row[column]));
        return `(${rowValues.join(", ")})`;
      })
      .join(", ");

    sql += values;

    return sql;
  }

  /**
   * Build an UPDATE query
   * @returns SQL query string
   */
  protected buildUpdateQuery(): string {
    if (!this.tableName) {
      throw new Error("No table specified for update query");
    }

    if (Object.keys(this.updateValues).length === 0) {
      throw new Error("No values specified for update query");
    }

    // Build SET clause
    const setClauses = Object.entries(this.updateValues)
      .map(([column, value]) => {
        return `${column} = ${formatValue(value)}`;
      })
      .join(", ");

    // Build the update query
    let sql = `ALTER TABLE ${this.tableName} UPDATE ${setClauses}`;

    // Add WHERE clause
    if (this.wheres.length > 0) {
      const whereClauses = this.wheres
        .map((where, index) => {
          const { column, operator, value, boolean, not } = where;
          const booleanOperator = index === 0 ? "" : ` ${boolean}`;
          const notOperator = not ? " NOT" : "";

          // Handle raw where clauses
          if (column instanceof Raw && operator === "") {
            return `${booleanOperator}${notOperator} ${column.toSql()}`;
          }

          const columnStr = column instanceof Raw ? column.toSql() : column;

          // Handle different operators
          switch (operator) {
            case "IN":
              if (!Array.isArray(value) || value.length === 0) {
                throw new Error(
                  "IN operator requires a non-empty array of values"
                );
              }

              const formattedValues = value
                .map((val) => formatValue(val))
                .join(", ");
              return `${booleanOperator}${notOperator} ${columnStr} IN (${formattedValues})`;

            case "BETWEEN":
              if (!Array.isArray(value) || value.length !== 2) {
                throw new Error(
                  "BETWEEN operator requires an array of exactly two values"
                );
              }

              return `${booleanOperator}${notOperator} ${columnStr} BETWEEN ${formatValue(
                value[0]
              )} AND ${formatValue(value[1])}`;

            case "IS":
              return `${booleanOperator} ${columnStr} IS${notOperator} NULL`;

            default:
              return `${booleanOperator}${notOperator} ${columnStr} ${operator} ${formatValue(
                value
              )}`;
          }
        })
        .join("");

      sql += ` WHERE ${whereClauses.trim()}`;
    }

    return sql;
  }

  /**
   * Build a DELETE query
   * @returns SQL query string
   */
  protected buildDeleteQuery(): string {
    if (!this.tableName) {
      throw new Error("No table specified for delete query");
    }

    // Build the delete query (ClickHouse uses ALTER TABLE ... DELETE syntax)
    let sql = `ALTER TABLE ${this.tableName} DELETE`;

    // Add WHERE clause
    if (this.wheres.length > 0) {
      const whereClauses = this.wheres
        .map((where, index) => {
          const { column, operator, value, boolean, not } = where;
          const booleanOperator = index === 0 ? "" : ` ${boolean}`;
          const notOperator = not ? " NOT" : "";

          // Handle raw where clauses
          if (column instanceof Raw && operator === "") {
            return `${booleanOperator}${notOperator} ${column.toSql()}`;
          }

          const columnStr = column instanceof Raw ? column.toSql() : column;

          // Handle different operators
          switch (operator) {
            case "IN":
              if (!Array.isArray(value) || value.length === 0) {
                throw new Error(
                  "IN operator requires a non-empty array of values"
                );
              }

              const formattedValues = value
                .map((val) => formatValue(val))
                .join(", ");
              return `${booleanOperator}${notOperator} ${columnStr} IN (${formattedValues})`;

            case "BETWEEN":
              if (!Array.isArray(value) || value.length !== 2) {
                throw new Error(
                  "BETWEEN operator requires an array of exactly two values"
                );
              }

              return `${booleanOperator}${notOperator} ${columnStr} BETWEEN ${formatValue(
                value[0]
              )} AND ${formatValue(value[1])}`;

            case "IS":
              return `${booleanOperator} ${columnStr} IS${notOperator} NULL`;

            default:
              return `${booleanOperator}${notOperator} ${columnStr} ${operator} ${formatValue(
                value
              )}`;
          }
        })
        .join("");

      sql += ` WHERE ${whereClauses.trim()}`;
    } else {
      throw new Error("DELETE queries require a WHERE clause");
    }

    return sql;
  }

  /**
   * Execute the query and get results
   * @param options - Query options
   * @returns Query result
   */
  public async get<T = any>(options?: QueryOptions): Promise<T[]> {
    const result = await this.connection.query<T>(this.toSql(), options);
    return result.data;
  }

  /**
   * Execute the query and get the first result
   * @param options - Query options
   * @returns Single result or null if not found
   */
  public async first<T = any>(options?: QueryOptions): Promise<T | null> {
    const results = await this.limit(1).get<T>(options);
    return results && results.length > 0 ? results[0] : null;
  }

  /**
   * Execute the query and get a value from the first result
   * @param column - Column to retrieve
   * @param options - Query options
   * @returns Column value or null if not found
   */
  public async value<T = any>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    const result = await this.select(column).first<Record<string, T>>(options);
    return result ? result[column] : null;
  }

  /**
   * Execute the query and get an array of values from a single column
   * @param column - Column to retrieve
   * @param options - Query options
   * @returns Array of column values
   */
  public async pluck<T = any>(
    column: string,
    options?: QueryOptions
  ): Promise<T[]> {
    const results = await this.select(column).get<Record<string, T>>(options);
    return results.map((result) => result[column]);
  }

  /**
   * Execute the query and get a count of the results
   * @param options - Query options
   * @returns Count of results
   */
  public async count(options?: QueryOptions): Promise<number> {
    // Save current columns and add count
    const currentColumns = [...this.columns];

    // Reset columns to count(*)
    this.columns = [new Raw("count(*) as count")];

    // Execute query
    const result = await this.first<{ count: number }>(options);

    // Restore columns
    this.columns = currentColumns;

    return result ? result.count : 0;
  }

  /**
   * Execute the query and determine if any results exist
   * @param options - Query options
   * @returns True if any results exist
   */
  public async exists(options?: QueryOptions): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }

  /**
   * Execute the query and determine if no results exist
   * @param options - Query options
   * @returns True if no results exist
   */
  public async doesntExist(options?: QueryOptions): Promise<boolean> {
    return !(await this.exists(options));
  }

  /**
   * Execute the query and get the minimum value for a column
   * @param column - Column to get minimum for
   * @param options - Query options
   * @returns Minimum value
   */
  public async min<T = any>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    const result = await this.select(
      new Raw(`min(${column}) as min_value`)
    ).first<{ min_value: T }>(options);

    return result ? result.min_value : null;
  }

  /**
   * Execute the query and get the maximum value for a column
   * @param column - Column to get maximum for
   * @param options - Query options
   * @returns Maximum value
   */
  public async max<T = any>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    const result = await this.select(
      new Raw(`max(${column}) as max_value`)
    ).first<{ max_value: T }>(options);

    return result ? result.max_value : null;
  }

  /**
   * Execute the query and get the sum of values for a column
   * @param column - Column to sum
   * @param options - Query options
   * @returns Sum of values
   */
  public async sum<T = number>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    const result = await this.select(
      new Raw(`sum(${column}) as sum_value`)
    ).first<{ sum_value: T }>(options);

    return result ? result.sum_value : null;
  }

  /**
   * Execute the query and get the average of values for a column
   * @param column - Column to average
   * @param options - Query options
   * @returns Average of values
   */
  public async avg<T = number>(
    column: string,
    options?: QueryOptions
  ): Promise<T | null> {
    const result = await this.select(
      new Raw(`avg(${column}) as avg_value`)
    ).first<{ avg_value: T }>(options);

    return result ? result.avg_value : null;
  }

  /**
   * Execute an insert query
   * @param values - Values to insert
   * @param options - Query options
   * @returns Query result
   */
  public async insert(
    values: Record<string, any> | Record<string, any>[],
    options?: QueryOptions
  ): Promise<QueryResult> {
    this.values(values);
    return this.connection.query(this.toSql(), options);
  }

  /**
   * Execute an update query
   * @param values - Values to update
   * @param options - Query options
   * @returns Query result
   */
  public async update(
    values: Record<string, any>,
    options?: QueryOptions
  ): Promise<QueryResult> {
    this.updateQuery(values);
    return this.connection.query(this.toSql(), options);
  }

  /**
   * Execute a delete query
   * @param options - Query options
   * @returns Query result
   */
  public async delete(options?: QueryOptions): Promise<QueryResult> {
    this.deleteQuery();
    return this.connection.query(this.toSql(), options);
  }

  /**
   * Execute a raw SQL query
   * @param sql - Raw SQL query to execute
   * @param options - Query options
   * @returns Query result data
   */
  public async rawQuery<T = any>(
    sql: string,
    options?: QueryOptions
  ): Promise<T[]> {
    const result = await this.connection.query<T>(sql, options);
    return result.data;
  }
}
