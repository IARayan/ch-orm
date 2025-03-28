[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / QueryResult

# Interface: QueryResult\<T\>

Defined in: [types/connection.ts:134](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L134)

Interface for query execution result

## Type Parameters

### T

`T` = `any`

## Properties

### data

> **data**: `T`[]

Defined in: [types/connection.ts:138](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L138)

Data returned by the query

***

### statistics?

> `optional` **statistics**: `object`

Defined in: [types/connection.ts:143](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L143)

Query statistics

#### rows\_read?

> `optional` **rows\_read**: `number`

Number of rows read

#### bytes\_read?

> `optional` **bytes\_read**: `number`

Number of bytes read

#### elapsed?

> `optional` **elapsed**: `number`

Time elapsed for query execution in seconds

#### rows\_returned?

> `optional` **rows\_returned**: `number`

Rows returned by the query

***

### meta?

> `optional` **meta**: `object`[]

Defined in: [types/connection.ts:168](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L168)

Query execution metadata

#### name

> **name**: `string`

Column name

#### type

> **type**: `string`

Column type
