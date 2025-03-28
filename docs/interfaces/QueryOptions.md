[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / QueryOptions

# Interface: QueryOptions

Defined in: [types/connection.ts:103](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L103)

Interface for query execution options

## Properties

### format?

> `optional` **format**: [`ResultFormat`](../enumerations/ResultFormat.md)

Defined in: [types/connection.ts:108](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L108)

Format for the query result

#### Default

```ts
ResultFormat.JSON
```

***

### session\_id?

> `optional` **session\_id**: `string`

Defined in: [types/connection.ts:113](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L113)

Session ID for the query

***

### timeout\_seconds?

> `optional` **timeout\_seconds**: `number`

Defined in: [types/connection.ts:118](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L118)

Query timeout in seconds

***

### max\_rows\_to\_read?

> `optional` **max\_rows\_to\_read**: `number`

Defined in: [types/connection.ts:123](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L123)

Maximum number of rows to return

***

### clickhouse\_settings?

> `optional` **clickhouse\_settings**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [types/connection.ts:128](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L128)

ClickHouse settings for the query
