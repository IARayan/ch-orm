[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / Schema

# Class: Schema

Defined in: [schema/Schema.ts:8](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L8)

Schema class for managing database schema
Used for creating and modifying tables, views, and other database objects

## Constructors

### Constructor

> **new Schema**(`connection`): `Schema`

Defined in: [schema/Schema.ts:18](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L18)

Create a new Schema instance

#### Parameters

##### connection

[`Connection`](Connection.md)

ClickHouse connection

#### Returns

`Schema`

## Methods

### create()

> **create**(`table`, `callback`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:28](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L28)

Create a new table

#### Parameters

##### table

`string`

Table name

##### callback

(`blueprint`) => `void`

Callback function to define table structure using Blueprint

#### Returns

`Promise`\<`void`\>

Promise that resolves when the table is created

***

### drop()

> **drop**(`table`, `ifExists`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:48](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L48)

Drop a table

#### Parameters

##### table

`string`

Table name

##### ifExists

`boolean` = `true`

Whether to include IF EXISTS in the query

#### Returns

`Promise`\<`void`\>

Promise that resolves when the table is dropped

***

### createOrReplace()

> **createOrReplace**(`table`, `callback`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:62](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L62)

Drop a table if it exists and create a new one

#### Parameters

##### table

`string`

Table name

##### callback

(`blueprint`) => `void`

Callback function to define table structure using Blueprint

#### Returns

`Promise`\<`void`\>

Promise that resolves when the table is recreated

***

### hasTable()

> **hasTable**(`table`): `Promise`\<`boolean`\>

Defined in: [schema/Schema.ts:78](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L78)

Check if a table exists

#### Parameters

##### table

`string`

Table name

#### Returns

`Promise`\<`boolean`\>

Promise that resolves to true if the table exists, false otherwise

***

### getTable()

> **getTable**(`table`): `Promise`\<`any`\>

Defined in: [schema/Schema.ts:98](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L98)

Get information about a table

#### Parameters

##### table

`string`

Table name

#### Returns

`Promise`\<`any`\>

Promise that resolves to table information or null if not found

***

### getColumns()

> **getColumns**(`table`): `Promise`\<`any`[]\>

Defined in: [schema/Schema.ts:118](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L118)

Get all columns in a table

#### Parameters

##### table

`string`

Table name

#### Returns

`Promise`\<`any`[]\>

Promise that resolves to array of column information

***

### hasColumn()

> **hasColumn**(`table`, `column`): `Promise`\<`boolean`\>

Defined in: [schema/Schema.ts:139](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L139)

Check if a column exists in a table

#### Parameters

##### table

`string`

Table name

##### column

`string`

Column name

#### Returns

`Promise`\<`boolean`\>

Promise that resolves to true if the column exists, false otherwise

***

### createMaterializedView()

> **createMaterializedView**(`viewName`, `selectQuery`, `toTable`?, `engine`?): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:163](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L163)

Create a materialized view

#### Parameters

##### viewName

`string`

View name

##### selectQuery

`string`

SELECT query for the view

##### toTable?

`string`

Target table (optional)

##### engine?

`string`

Engine for the view (if not using TO table)

#### Returns

`Promise`\<`void`\>

Promise that resolves when the view is created

***

### dropMaterializedView()

> **dropMaterializedView**(`viewName`, `ifExists`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:194](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L194)

Drop a materialized view

#### Parameters

##### viewName

`string`

View name

##### ifExists

`boolean` = `true`

Whether to include IF EXISTS in the query

#### Returns

`Promise`\<`void`\>

Promise that resolves when the view is dropped

***

### createView()

> **createView**(`viewName`, `selectQuery`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:210](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L210)

Create a view

#### Parameters

##### viewName

`string`

View name

##### selectQuery

`string`

SELECT query for the view

#### Returns

`Promise`\<`void`\>

Promise that resolves when the view is created

***

### dropView()

> **dropView**(`viewName`, `ifExists`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:224](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L224)

Drop a view

#### Parameters

##### viewName

`string`

View name

##### ifExists

`boolean` = `true`

Whether to include IF EXISTS in the query

#### Returns

`Promise`\<`void`\>

Promise that resolves when the view is dropped

***

### createDictionary()

> **createDictionary**(`dictionaryName`, `structure`, `source`, `layout`, `lifetime`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:241](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L241)

Create a dictionary

#### Parameters

##### dictionaryName

`string`

Dictionary name

##### structure

`string`

Dictionary structure

##### source

`string`

Dictionary source

##### layout

`string`

Dictionary layout

##### lifetime

`string`

Dictionary lifetime

#### Returns

`Promise`\<`void`\>

Promise that resolves when the dictionary is created

***

### dropDictionary()

> **dropDictionary**(`dictionaryName`, `ifExists`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:268](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L268)

Drop a dictionary

#### Parameters

##### dictionaryName

`string`

Dictionary name

##### ifExists

`boolean` = `true`

Whether to include IF EXISTS in the query

#### Returns

`Promise`\<`void`\>

Promise that resolves when the dictionary is dropped

***

### createDatabase()

> **createDatabase**(`databaseName`, `ifNotExists`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:284](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L284)

Create a database

#### Parameters

##### databaseName

`string`

Database name

##### ifNotExists

`boolean` = `true`

Whether to include IF NOT EXISTS in the query

#### Returns

`Promise`\<`void`\>

Promise that resolves when the database is created

***

### dropDatabase()

> **dropDatabase**(`databaseName`, `ifExists`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:300](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L300)

Drop a database

#### Parameters

##### databaseName

`string`

Database name

##### ifExists

`boolean` = `true`

Whether to include IF EXISTS in the query

#### Returns

`Promise`\<`void`\>

Promise that resolves when the database is dropped

***

### raw()

> **raw**(`sql`): `Promise`\<`any`\>

Defined in: [schema/Schema.ts:313](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L313)

Execute raw SQL

#### Parameters

##### sql

`string`

SQL query

#### Returns

`Promise`\<`any`\>

Promise that resolves with the query result

***

### alter()

> **alter**(`table`, `callback`): `Promise`\<`void`\>

Defined in: [schema/Schema.ts:323](https://github.com/iarayan/ch-orm/blob/main/src/schema/Schema.ts#L323)

Alter a table

#### Parameters

##### table

`string`

Table name

##### callback

(`blueprint`) => `void`

Callback function to define table alterations using Blueprint

#### Returns

`Promise`\<`void`\>

Promise that resolves when the table is altered
