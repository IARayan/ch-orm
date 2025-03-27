/**
 * ClickHouse data types enumeration
 * Comprehensive list of data types supported by ClickHouse
 */
export enum DataTypes {
  // Integer types
  INT8 = "Int8",
  UINT8 = "UInt8",
  INT16 = "Int16",
  UINT16 = "UInt16",
  INT32 = "Int32",
  UINT32 = "UInt32",
  INT64 = "Int64",
  UINT64 = "UInt64",
  INT128 = "Int128",
  UINT128 = "UInt128",
  INT256 = "Int256",
  UINT256 = "UInt256",

  // Floating point types
  FLOAT32 = "Float32",
  FLOAT64 = "Float64",

  // Decimal types
  DECIMAL = "Decimal",
  DECIMAL32 = "Decimal32",
  DECIMAL64 = "Decimal64",
  DECIMAL128 = "Decimal128",
  DECIMAL256 = "Decimal256",

  // String types
  STRING = "String",
  FIXED_STRING = "FixedString",

  // Date and time types
  DATE = "Date",
  DATE32 = "Date32",
  DATETIME = "DateTime",
  DATETIME64 = "DateTime64",

  // Boolean type (represented as UInt8)
  BOOLEAN = "Bool",

  // UUID type
  UUID = "UUID",

  // Array type
  ARRAY = "Array",

  // Tuple type
  TUPLE = "Tuple",

  // Map type
  MAP = "Map",

  // Nullable modifier
  NULLABLE = "Nullable",

  // Enum types
  ENUM8 = "Enum8",
  ENUM16 = "Enum16",

  // LowCardinality modifier
  LOW_CARDINALITY = "LowCardinality",

  // Nested type
  NESTED = "Nested",

  // IPv4 and IPv6 types
  IPV4 = "IPv4",
  IPV6 = "IPv6",

  // Geo types
  POINT = "Point",
  RING = "Ring",
  POLYGON = "Polygon",
  MULTIPOLYGON = "MultiPolygon",

  // Special types
  NOTHING = "Nothing",
  INTERVAL = "Interval",
  JSON = "JSON",
}

/**
 * ClickHouse table engines
 */
export enum TableEngines {
  // Core engines
  MERGE_TREE = "MergeTree",
  REPLACING_MERGE_TREE = "ReplacingMergeTree",
  SUMMING_MERGE_TREE = "SummingMergeTree",
  AGGREGATING_MERGE_TREE = "AggregatingMergeTree",
  COLLAPSING_MERGE_TREE = "CollapsingMergeTree",
  VERSIONED_COLLAPSING_MERGE_TREE = "VersionedCollapsingMergeTree",
  GRAPHITE_MERGE_TREE = "GraphiteMergeTree",

  // Log family
  LOG = "Log",
  TINY_LOG = "TinyLog",
  STRIPE_LOG = "StripeLog",

  // Integration engines
  KAFKA = "Kafka",
  MYSQL = "MySQL",
  POSTGRESQL = "PostgreSQL",
  JDBC = "JDBC",
  HDFS = "HDFS",
  S3 = "S3",

  // Special engines
  DISTRIBUTED = "Distributed",
  MATERIALIZED_VIEW = "MaterializedView",
  DICTIONARY = "Dictionary",
  MERGE = "Merge",
  FILE = "File",
  NULL = "Null",
  BUFFER = "Buffer",
  MEMORY = "Memory",
  SET = "Set",
  JOIN = "Join",
  URL = "URL",
  VIEW = "View",
}

/**
 * Interval types for ClickHouse
 */
export enum IntervalTypes {
  SECOND = "SECOND",
  MINUTE = "MINUTE",
  HOUR = "HOUR",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
}

/**
 * Collection of ClickHouse specific SQL functions
 */
export const Functions = {
  // Date and time functions
  NOW: "now()",
  TODAY: "today()",
  YESTERDAY: "yesterday()",
  TOMORROW: "tomorrow()",
  TO_YEAR_BEGIN: "toYearBegin",
  TO_QUARTER_BEGIN: "toQuarterBegin",
  TO_MONTH_BEGIN: "toMonthBegin",
  TO_WEEK_BEGIN: "toWeekBegin",
  TO_DAY_BEGIN: "toDayBegin",
  TO_HOUR_BEGIN: "toHourBegin",
  TO_MINUTE_BEGIN: "toMinuteBegin",
  TO_DATE: "toDate",
  TO_DATETIME: "toDateTime",
  TO_UNIX_TIMESTAMP: "toUnixTimestamp",
  FROM_UNIX_TIMESTAMP: "fromUnixTimestamp",

  // Array functions
  ARRAY: "array",
  ARRAY_JOIN: "arrayJoin",
  ARRAY_MAP: "arrayMap",
  ARRAY_FILTER: "arrayFilter",
  ARRAY_COUNT: "arrayCount",
  ARRAY_SUM: "arraySum",
  ARRAY_DISTINCT: "arrayDistinct",
  ARRAY_ENUMERATE: "arrayEnumerate",

  // Aggregate functions
  COUNT: "count",
  SUM: "sum",
  AVG: "avg",
  MIN: "min",
  MAX: "max",
  GROUP_ARRAY: "groupArray",
  GROUP_ARRAY_DISTINCT: "groupArrayDistinct",
  GROUP_ARRAY_MOVING_AVG: "groupArrayMovingAvg",
  QUANTILE: "quantile",
  MEDIAN: "median",

  // String functions
  CONCAT: "concat",
  SUBSTRING: "substring",
  TRIM: "trim",
  LOWER: "lower",
  UPPER: "upper",
  LENGTH: "length",
  POSITION: "position",

  // Hash functions
  MD5: "MD5",
  SHA1: "SHA1",
  SHA224: "SHA224",
  SHA256: "SHA256",
  CITY_HASH64: "cityHash64",

  // Math functions
  ABS: "abs",
  ROUND: "round",
  FLOOR: "floor",
  CEIL: "ceil",

  // Conditional functions
  IF: "if",
  MULTI_IF: "multiIf",
  CASE: "CASE",
};
