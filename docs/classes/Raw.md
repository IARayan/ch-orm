[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / Raw

# Class: Raw

Defined in: [query/Raw.ts:5](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L5)

Raw SQL expression class for use in queries
Allows inserting raw SQL into query builder statements

## Constructors

### Constructor

> **new Raw**(`value`): `Raw`

Defined in: [query/Raw.ts:15](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L15)

Create a new Raw SQL expression

#### Parameters

##### value

`string`

The raw SQL value

#### Returns

`Raw`

## Methods

### toSql()

> **toSql**(): `string`

Defined in: [query/Raw.ts:23](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L23)

Get the raw SQL value

#### Returns

`string`

Raw SQL string

***

### make()

> `static` **make**(`value`): `Raw`

Defined in: [query/Raw.ts:32](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L32)

Create a raw SQL expression

#### Parameters

##### value

`string`

Raw SQL value

#### Returns

`Raw`

Raw SQL expression instance

***

### toString()

> **toString**(): `string`

Defined in: [query/Raw.ts:40](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L40)

String representation of the raw SQL

#### Returns

`string`

Raw SQL string

***

### column()

> `static` **column**(`name`): `Raw`

Defined in: [query/Raw.ts:49](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L49)

Create a raw SQL expression for a column name

#### Parameters

##### name

`string`

Column name

#### Returns

`Raw`

Raw SQL expression with properly escaped column name

***

### table()

> `static` **table**(`name`): `Raw`

Defined in: [query/Raw.ts:65](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L65)

Create a raw expression for a table name

#### Parameters

##### name

`string`

Table name

#### Returns

`Raw`

Raw SQL expression with properly escaped table name

***

### now()

> `static` **now**(): `Raw`

Defined in: [query/Raw.ts:80](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L80)

Create a raw expression for now()

#### Returns

`Raw`

Raw SQL expression for current timestamp

***

### today()

> `static` **today**(): `Raw`

Defined in: [query/Raw.ts:88](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L88)

Create a raw expression for today()

#### Returns

`Raw`

Raw SQL expression for today's date

***

### fn()

> `static` **fn**(`name`, ...`params`): `Raw`

Defined in: [query/Raw.ts:98](https://github.com/iarayan/ch-orm/blob/main/src/query/Raw.ts#L98)

Create a raw expression for a ClickHouse function

#### Parameters

##### name

`string`

Function name

##### params

...`any`[]

Function parameters

#### Returns

`Raw`

Raw SQL expression for function call
