[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / QueryBuilder

# Class: QueryBuilder

Defined in: [query/QueryBuilder.ts:43](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L43)

Query builder class for constructing SQL queries with a fluent interface
Provides an Eloquent-like query building experience

## Constructors

### Constructor

> **new QueryBuilder**(`connection`, `table`?): `QueryBuilder`

Defined in: [query/QueryBuilder.ts:129](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L129)

Create a new QueryBuilder instance

#### Parameters

##### connection

[`Connection`](Connection.md)

ClickHouse connection

##### table?

`string`

Table name (optional)

#### Returns

`QueryBuilder`

## Methods

### from()

> **from**(`table`): `this`

Defined in: [query/QueryBuilder.ts:142](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L142)

Set the table to query

#### Parameters

##### table

`string`

Table name

#### Returns

`this`

QueryBuilder instance for chaining

***

### table()

> **table**(`table`): `this`

Defined in: [query/QueryBuilder.ts:152](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L152)

Set the table to query

#### Parameters

##### table

`string`

Table name

#### Returns

`this`

QueryBuilder instance for chaining

***

### final()

> **final**(): `this`

Defined in: [query/QueryBuilder.ts:160](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L160)

Add a FINAL modifier to the query

#### Returns

`this`

QueryBuilder instance for chaining

***

### sample()

> **sample**(`rate`): `this`

Defined in: [query/QueryBuilder.ts:170](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L170)

Add a SAMPLE modifier to the query

#### Parameters

##### rate

`number`

Sample rate (0.0 to 1.0)

#### Returns

`this`

QueryBuilder instance for chaining

***

### select()

> **select**(...`columns`): `this`

Defined in: [query/QueryBuilder.ts:184](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L184)

Set the columns to select

#### Parameters

##### columns

...(`string` \| [`Raw`](Raw.md))[]

Column names or Raw expressions

#### Returns

`this`

QueryBuilder instance for chaining

***

### where()

> **where**(`column`, `operator`?, `value`?): `this`

Defined in: [query/QueryBuilder.ts:197](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L197)

Add a where clause

#### Parameters

##### column

Column name or Raw expression

`string` | `Record`\<`string`, `any`\> | [`Raw`](Raw.md)

##### operator?

`any`

Comparison operator or value if operator is omitted

##### value?

`any`

Value to compare (optional if operator is actually the value)

#### Returns

`this`

QueryBuilder instance for chaining

***

### orWhere()

> **orWhere**(`column`, `operator`?, `value`?): `this`

Defined in: [query/QueryBuilder.ts:234](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L234)

Add an OR where clause

#### Parameters

##### column

Column name or Raw expression

`string` | `Record`\<`string`, `any`\> | [`Raw`](Raw.md)

##### operator?

`any`

Comparison operator or value if operator is omitted

##### value?

`any`

Value to compare (optional if operator is actually the value)

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereNot()

> **whereNot**(`column`, `operator`?, `value`?): `this`

Defined in: [query/QueryBuilder.ts:280](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L280)

Add a where not clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### operator?

`any`

Comparison operator or value if operator is omitted

##### value?

`any`

Value to compare (optional if operator is actually the value)

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereIn()

> **whereIn**(`column`, `values`): `this`

Defined in: [query/QueryBuilder.ts:308](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L308)

Add a where in clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### values

`any`[]

Array of values to check against

#### Returns

`this`

QueryBuilder instance for chaining

***

### orWhereIn()

> **orWhereIn**(`column`, `values`): `this`

Defined in: [query/QueryBuilder.ts:329](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L329)

Add an or where in clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### values

`any`[]

Array of values to check against

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereNotIn()

> **whereNotIn**(`column`, `values`): `this`

Defined in: [query/QueryBuilder.ts:350](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L350)

Add a where not in clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### values

`any`[]

Array of values to check against

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereBetween()

> **whereBetween**(`column`, `values`): `this`

Defined in: [query/QueryBuilder.ts:372](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L372)

Add a where between clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### values

\[`any`, `any`\]

Array of two values [min, max]

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereNotBetween()

> **whereNotBetween**(`column`, `values`): `this`

Defined in: [query/QueryBuilder.ts:393](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L393)

Add a where not between clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### values

\[`any`, `any`\]

Array of two values [min, max]

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereNull()

> **whereNull**(`column`): `this`

Defined in: [query/QueryBuilder.ts:416](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L416)

Add a where null clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereNotNull()

> **whereNotNull**(`column`): `this`

Defined in: [query/QueryBuilder.ts:432](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L432)

Add a where not null clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

#### Returns

`this`

QueryBuilder instance for chaining

***

### whereRaw()

> **whereRaw**(`sql`, `bindings`): `this`

Defined in: [query/QueryBuilder.ts:450](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L450)

Add a raw where clause

#### Parameters

##### sql

`string`

Raw SQL for where clause

##### bindings

`any`[] = `[]`

Parameter bindings for the SQL

#### Returns

`this`

QueryBuilder instance for chaining

***

### orWhereRaw()

> **orWhereRaw**(`sql`, `bindings`): `this`

Defined in: [query/QueryBuilder.ts:473](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L473)

Add a raw or where clause

#### Parameters

##### sql

`string`

Raw SQL for where clause

##### bindings

`any`[] = `[]`

Parameter bindings for the SQL

#### Returns

`this`

QueryBuilder instance for chaining

***

### join()

> **join**(`table`, `first`, `operator`?, `second`?): `this`

Defined in: [query/QueryBuilder.ts:498](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L498)

Add an inner join clause

#### Parameters

##### table

`string`

Table to join

##### first

First column or a callback function

`string` | [`Raw`](Raw.md) | (`join`) => `void`

##### operator?

`string`

Comparison operator

##### second?

Second column

`string` | [`Raw`](Raw.md)

#### Returns

`this`

QueryBuilder instance for chaining

***

### leftJoin()

> **leftJoin**(`table`, `first`, `operator`?, `second`?): `this`

Defined in: [query/QueryBuilder.ts:515](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L515)

Add a left join clause

#### Parameters

##### table

`string`

Table to join

##### first

First column or a callback function

`string` | [`Raw`](Raw.md) | (`join`) => `void`

##### operator?

`string`

Comparison operator

##### second?

Second column

`string` | [`Raw`](Raw.md)

#### Returns

`this`

QueryBuilder instance for chaining

***

### rightJoin()

> **rightJoin**(`table`, `first`, `operator`?, `second`?): `this`

Defined in: [query/QueryBuilder.ts:532](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L532)

Add a right join clause

#### Parameters

##### table

`string`

Table to join

##### first

First column or a callback function

`string` | [`Raw`](Raw.md) | (`join`) => `void`

##### operator?

`string`

Comparison operator

##### second?

Second column

`string` | [`Raw`](Raw.md)

#### Returns

`this`

QueryBuilder instance for chaining

***

### fullJoin()

> **fullJoin**(`table`, `first`, `operator`?, `second`?): `this`

Defined in: [query/QueryBuilder.ts:549](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L549)

Add a full join clause

#### Parameters

##### table

`string`

Table to join

##### first

First column or a callback function

`string` | [`Raw`](Raw.md) | (`join`) => `void`

##### operator?

`string`

Comparison operator

##### second?

Second column

`string` | [`Raw`](Raw.md)

#### Returns

`this`

QueryBuilder instance for chaining

***

### crossJoin()

> **crossJoin**(`table`): `this`

Defined in: [query/QueryBuilder.ts:563](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L563)

Add a cross join clause

#### Parameters

##### table

`string`

Table to join

#### Returns

`this`

QueryBuilder instance for chaining

***

### groupBy()

> **groupBy**(...`columns`): `this`

Defined in: [query/QueryBuilder.ts:620](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L620)

Add a group by clause

#### Parameters

##### columns

...(`string` \| [`Raw`](Raw.md))[]

Columns to group by

#### Returns

`this`

QueryBuilder instance for chaining

***

### having()

> **having**(`column`, `operator`?, `value`?): `this`

Defined in: [query/QueryBuilder.ts:632](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L632)

Add a having clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### operator?

`any`

Comparison operator or value if operator is omitted

##### value?

`any`

Value to compare (optional if operator is actually the value)

#### Returns

`this`

QueryBuilder instance for chaining

***

### orHaving()

> **orHaving**(`column`, `operator`?, `value`?): `this`

Defined in: [query/QueryBuilder.ts:660](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L660)

Add an or having clause

#### Parameters

##### column

Column name or Raw expression

`string` | [`Raw`](Raw.md)

##### operator?

`any`

Comparison operator or value if operator is omitted

##### value?

`any`

Value to compare (optional if operator is actually the value)

#### Returns

`this`

QueryBuilder instance for chaining

***

### orderBy()

> **orderBy**(`column`, `direction`): `this`

Defined in: [query/QueryBuilder.ts:687](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L687)

Add an order by clause

#### Parameters

##### column

Column to order by

`string` | [`Raw`](Raw.md)

##### direction

Direction (ASC or DESC)

`"ASC"` | `"DESC"`

#### Returns

`this`

QueryBuilder instance for chaining

***

### orderByDesc()

> **orderByDesc**(`column`): `this`

Defined in: [query/QueryBuilder.ts:704](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L704)

Add an order by desc clause

#### Parameters

##### column

Column to order by

`string` | [`Raw`](Raw.md)

#### Returns

`this`

QueryBuilder instance for chaining

***

### limit()

> **limit**(`value`): `this`

Defined in: [query/QueryBuilder.ts:713](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L713)

Set the limit value

#### Parameters

##### value

`number`

Limit value

#### Returns

`this`

QueryBuilder instance for chaining

***

### offset()

> **offset**(`value`): `this`

Defined in: [query/QueryBuilder.ts:723](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L723)

Set the offset value

#### Parameters

##### value

`number`

Offset value

#### Returns

`this`

QueryBuilder instance for chaining

***

### with()

> **with**(`name`, `query`): `this`

Defined in: [query/QueryBuilder.ts:734](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L734)

Add a with clause

#### Parameters

##### name

`string`

CTE name

##### query

Query builder instance or Raw expression

[`Raw`](Raw.md) | `QueryBuilder`

#### Returns

`this`

QueryBuilder instance for chaining

***

### values()

> **values**(`values`): `this`

Defined in: [query/QueryBuilder.ts:744](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L744)

Set insert values

#### Parameters

##### values

Values to insert

`Record`\<`string`, `any`\> | `Record`\<`string`, `any`\>[]

#### Returns

`this`

QueryBuilder instance for chaining

***

### updateQuery()

> **updateQuery**(`values`): `this`

Defined in: [query/QueryBuilder.ts:761](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L761)

Set update values

#### Parameters

##### values

`Record`\<`string`, `any`\>

Values to update

#### Returns

`this`

QueryBuilder instance for chaining

***

### deleteQuery()

> **deleteQuery**(): `this`

Defined in: [query/QueryBuilder.ts:771](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L771)

Set query type to DELETE

#### Returns

`this`

QueryBuilder instance for chaining

***

### toSql()

> **toSql**(): `string`

Defined in: [query/QueryBuilder.ts:780](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L780)

Build the SQL query string

#### Returns

`string`

SQL query string

***

### get()

> **get**\<`T`\>(`options`?): `Promise`\<`T`[]\>

Defined in: [query/QueryBuilder.ts:1173](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1173)

Execute the query and get results

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`T`[]\>

Query result

***

### first()

> **first**\<`T`\>(`options`?): `Promise`\<`null` \| `T`\>

Defined in: [query/QueryBuilder.ts:1183](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1183)

Execute the query and get the first result

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Single result or null if not found

***

### value()

> **value**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [query/QueryBuilder.ts:1194](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1194)

Execute the query and get a value from the first result

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### column

`string`

Column to retrieve

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Column value or null if not found

***

### pluck()

> **pluck**\<`T`\>(`column`, `options`?): `Promise`\<`T`[]\>

Defined in: [query/QueryBuilder.ts:1208](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1208)

Execute the query and get an array of values from a single column

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### column

`string`

Column to retrieve

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`T`[]\>

Array of column values

***

### count()

> **count**(`options`?): `Promise`\<`number`\>

Defined in: [query/QueryBuilder.ts:1221](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1221)

Execute the query and get a count of the results

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`number`\>

Count of results

***

### exists()

> **exists**(`options`?): `Promise`\<`boolean`\>

Defined in: [query/QueryBuilder.ts:1242](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1242)

Execute the query and determine if any results exist

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`boolean`\>

True if any results exist

***

### doesntExist()

> **doesntExist**(`options`?): `Promise`\<`boolean`\>

Defined in: [query/QueryBuilder.ts:1252](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1252)

Execute the query and determine if no results exist

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`boolean`\>

True if no results exist

***

### min()

> **min**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [query/QueryBuilder.ts:1262](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1262)

Execute the query and get the minimum value for a column

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### column

`string`

Column to get minimum for

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Minimum value

***

### max()

> **max**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [query/QueryBuilder.ts:1279](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1279)

Execute the query and get the maximum value for a column

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### column

`string`

Column to get maximum for

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Maximum value

***

### sum()

> **sum**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [query/QueryBuilder.ts:1296](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1296)

Execute the query and get the sum of values for a column

#### Type Parameters

##### T

`T` = `number`

#### Parameters

##### column

`string`

Column to sum

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Sum of values

***

### avg()

> **avg**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [query/QueryBuilder.ts:1313](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1313)

Execute the query and get the average of values for a column

#### Type Parameters

##### T

`T` = `number`

#### Parameters

##### column

`string`

Column to average

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Average of values

***

### insert()

> **insert**(`values`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [query/QueryBuilder.ts:1330](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1330)

Execute an insert query

#### Parameters

##### values

Values to insert

`Record`\<`string`, `any`\> | `Record`\<`string`, `any`\>[]

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Query result

***

### update()

> **update**(`values`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [query/QueryBuilder.ts:1344](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1344)

Execute an update query

#### Parameters

##### values

`Record`\<`string`, `any`\>

Values to update

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Query result

***

### delete()

> **delete**(`options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [query/QueryBuilder.ts:1357](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1357)

Execute a delete query

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Query result

***

### rawQuery()

> **rawQuery**\<`T`\>(`sql`, `options`?): `Promise`\<`T`[]\>

Defined in: [query/QueryBuilder.ts:1368](https://github.com/iarayan/ch-orm/blob/main/src/query/QueryBuilder.ts#L1368)

Execute a raw SQL query

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### sql

`string`

Raw SQL query to execute

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`T`[]\>

Query result data
