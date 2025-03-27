/**
 * Collection of utility helper functions for the CH-ORM library
 */

/**
 * Escape a string value for use in SQL queries
 * @param value - The string value to escape
 * @returns Escaped string value
 */
export function escapeString(value: string): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Format a value for use in SQL based on its JavaScript type
 * @param value - The value to format
 * @returns Formatted value ready for SQL
 */
export function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "string") {
    return escapeString(value);
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (value instanceof Date) {
    return `toDateTime('${value
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}')`;
  }

  if (Array.isArray(value)) {
    const formattedValues = value.map(formatValue).join(", ");
    return `[${formattedValues}]`;
  }

  if (typeof value === "object") {
    return escapeString(JSON.stringify(value));
  }

  return escapeString(String(value));
}

/**
 * Convert a camelCase string to snake_case
 * @param str - The camelCase string
 * @returns The snake_case string
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert a snake_case string to camelCase
 * @param str - The snake_case string
 * @returns The camelCase string
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Generate a timestamp-based migration filename
 * @param name - Migration name
 * @returns Formatted migration filename
 */
export function generateMigrationFilename(name: string): string {
  const timestamp = new Date().getTime();
  const formattedName = name.toLowerCase().replace(/\s+/g, "_");
  return `${timestamp}_${formattedName}.ts`;
}

/**
 * Get current timestamp for migration versioning
 * @returns Current timestamp
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Check if a value is a plain object
 * @param value - Value to check
 * @returns True if value is a plain object
 */
export function isPlainObject(value: any): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

/**
 * Pluralize a word using basic English rules
 * @param word - Word to pluralize
 * @returns Pluralized word
 */
export function pluralize(word: string): string {
  if (word.endsWith("y")) {
    return word.slice(0, -1) + "ies";
  }
  if (
    word.endsWith("s") ||
    word.endsWith("x") ||
    word.endsWith("z") ||
    word.endsWith("ch") ||
    word.endsWith("sh")
  ) {
    return word + "es";
  }
  return word + "s";
}

/**
 * Singularize a word using basic English rules
 * @param word - Word to singularize
 * @returns Singularized word
 */
export function singularize(word: string): string {
  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  }
  if (
    word.endsWith("es") &&
    (word.endsWith("ses") ||
      word.endsWith("xes") ||
      word.endsWith("zes") ||
      word.endsWith("ches") ||
      word.endsWith("shes"))
  ) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (isPlainObject(obj)) {
    const copy: any = {};

    Object.keys(obj).forEach((key) => {
      copy[key] = deepClone((obj as any)[key]);
    });

    return copy;
  }

  return obj;
}
