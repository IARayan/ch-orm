/**
 * Raw SQL expression class for use in queries
 * Allows inserting raw SQL into query builder statements
 */
export class Raw {
  /**
   * The raw SQL value
   */
  private value: string;

  /**
   * Create a new Raw SQL expression
   * @param value - The raw SQL value
   */
  constructor(value: string) {
    this.value = value;
  }

  /**
   * Get the raw SQL value
   * @returns Raw SQL string
   */
  public toSql(): string {
    return this.value;
  }

  /**
   * Create a raw SQL expression
   * @param value - Raw SQL value
   * @returns Raw SQL expression instance
   */
  public static make(value: string): Raw {
    return new Raw(value);
  }

  /**
   * String representation of the raw SQL
   * @returns Raw SQL string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Create a raw SQL expression for a column name
   * @param name - Column name
   * @returns Raw SQL expression with properly escaped column name
   */
  public static column(name: string): Raw {
    // Handle column names with dots (table.column format)
    if (name.includes(".")) {
      const parts = name.split(".");
      return new Raw(parts.map((part) => `\`${part}\``).join("."));
    }

    // Handle normal column names
    return new Raw(`\`${name}\``);
  }

  /**
   * Create a raw expression for a table name
   * @param name - Table name
   * @returns Raw SQL expression with properly escaped table name
   */
  public static table(name: string): Raw {
    // Handle table names with dots (database.table format)
    if (name.includes(".")) {
      const parts = name.split(".");
      return new Raw(parts.map((part) => `\`${part}\``).join("."));
    }

    // Handle normal table names
    return new Raw(`\`${name}\``);
  }

  /**
   * Create a raw expression for now()
   * @returns Raw SQL expression for current timestamp
   */
  public static now(): Raw {
    return new Raw("now()");
  }

  /**
   * Create a raw expression for today()
   * @returns Raw SQL expression for today's date
   */
  public static today(): Raw {
    return new Raw("today()");
  }

  /**
   * Create a raw expression for a ClickHouse function
   * @param name - Function name
   * @param params - Function parameters
   * @returns Raw SQL expression for function call
   */
  public static fn(name: string, ...params: any[]): Raw {
    const formattedParams = params
      .map((param) => {
        if (param instanceof Raw) {
          return param.toSql();
        }

        if (typeof param === "string") {
          return `'${param.replace(/'/g, "''")}'`;
        }

        if (param === null || param === undefined) {
          return "NULL";
        }

        return String(param);
      })
      .join(", ");

    return new Raw(`${name}(${formattedParams})`);
  }
}
