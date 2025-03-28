[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / Model

# Class: `abstract` Model

Defined in: [model/Model.ts:22](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L22)

Base Model class with ORM functionality
Provides static and instance methods for interacting with ClickHouse tables

## Constructors

### Constructor

> **new Model**(): `Model`

#### Returns

`Model`

## Methods

### setConnection()

> `static` **setConnection**(`connection`): `void`

Defined in: [model/Model.ts:32](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L32)

Set the database connection for all models

#### Parameters

##### connection

ClickHouse connection or connection pool

[`Connection`](Connection.md) | [`ConnectionPool`](ConnectionPool.md)

#### Returns

`void`

***

### getTableName()

> `static` **getTableName**(): `string`

Defined in: [model/Model.ts:95](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L95)

Get the table name for this model

#### Returns

`string`

Table name

***

### getColumns()

> `static` **getColumns**(): `Map`\<`string`, [`ColumnMetadata`](../interfaces/ColumnMetadata.md)\>

Defined in: [model/Model.ts:111](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L111)

Get the column metadata for this model

#### Returns

`Map`\<`string`, [`ColumnMetadata`](../interfaces/ColumnMetadata.md)\>

Map of property names to column metadata

***

### getPrimaryKeys()

> `static` **getPrimaryKeys**(): `string`[]

Defined in: [model/Model.ts:119](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L119)

Get the primary key columns for this model

#### Returns

`string`[]

Array of primary key column names

***

### query()

> `static` **query**(): [`QueryBuilder`](QueryBuilder.md)

Defined in: [model/Model.ts:127](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L127)

Create a new query builder for this model

#### Returns

[`QueryBuilder`](QueryBuilder.md)

Query builder instance

***

### all()

> `static` **all**\<`T`\>(`options`?): `Promise`\<`T`[]\>

Defined in: [model/Model.ts:142](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L142)

Get all records from the table

#### Type Parameters

##### T

`T` *extends* `Model`

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`T`[]\>

Promise that resolves to array of model instances

***

### find()

> `static` **find**\<`T`\>(`id`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [model/Model.ts:160](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L160)

Find a record by its primary key

#### Type Parameters

##### T

`T` *extends* `Model`

#### Parameters

##### id

Primary key value

`string` | `number`

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Promise that resolves to model instance or null if not found

***

### findOrFail()

> `static` **findOrFail**\<`T`\>(`id`, `options`?): `Promise`\<`T`\>

Defined in: [model/Model.ts:193](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L193)

Find a record by some conditions or throw an error if not found

#### Type Parameters

##### T

`T` *extends* `Model`

#### Parameters

##### id

Primary key value

`string` | `number`

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`T`\>

Promise that resolves to model instance

#### Throws

Error if record not found

***

### findBy()

> `static` **findBy**\<`T`\>(`conditions`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [model/Model.ts:215](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L215)

Find first record matching the conditions

#### Type Parameters

##### T

`T` *extends* `Model`

#### Parameters

##### conditions

`Record`\<`string`, `any`\>

Conditions to match

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Promise that resolves to model instance or null if not found

***

### create()

> `static` **create**\<`T`\>(`attributes`): `T`

Defined in: [model/Model.ts:234](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L234)

Create a new model instance with the given attributes

#### Type Parameters

##### T

`T` *extends* `Model`

#### Parameters

##### attributes

`Record`\<`string`, `any`\>

Attributes to set on the model

#### Returns

`T`

Model instance

***

### createAndSave()

> `static` **createAndSave**\<`T`\>(`attributes`, `options`?): `Promise`\<`T`\>

Defined in: [model/Model.ts:252](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L252)

Create a new model instance with the given attributes and save it to the database

#### Type Parameters

##### T

`T` *extends* `Model`

#### Parameters

##### attributes

`Record`\<`string`, `any`\>

Attributes to set on the model

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`T`\>

Promise that resolves to model instance

***

### count()

> `static` **count**(`options`?): `Promise`\<`number`\>

Defined in: [model/Model.ts:291](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L291)

Count records in the table

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`number`\>

Promise that resolves to record count

***

### max()

> `static` **max**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [model/Model.ts:301](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L301)

Get the maximum value of a column

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### column

`string`

Column name

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Promise that resolves to maximum value

***

### min()

> `static` **min**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [model/Model.ts:314](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L314)

Get the minimum value of a column

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### column

`string`

Column name

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Promise that resolves to minimum value

***

### sum()

> `static` **sum**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [model/Model.ts:327](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L327)

Get the sum of values in a column

#### Type Parameters

##### T

`T` = `number`

#### Parameters

##### column

`string`

Column name

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Promise that resolves to sum of values

***

### avg()

> `static` **avg**\<`T`\>(`column`, `options`?): `Promise`\<`null` \| `T`\>

Defined in: [model/Model.ts:340](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L340)

Get the average of values in a column

#### Type Parameters

##### T

`T` = `number`

#### Parameters

##### column

`string`

Column name

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<`null` \| `T`\>

Promise that resolves to average of values

***

### insert()

> `static` **insert**(`data`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [model/Model.ts:353](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L353)

Insert records into the table

#### Parameters

##### data

Data to insert (single record or array of records)

`Record`\<`string`, `any`\> | `Record`\<`string`, `any`\>[]

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Promise that resolves to query result

***

### deleteWhere()

> `static` **deleteWhere**(`conditions`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [model/Model.ts:401](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L401)

Delete records by condition

#### Parameters

##### conditions

`Record`\<`string`, `any`\>

Conditions to match for deletion

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Promise that resolves to query result

***

### deleteById()

> `static` **deleteById**(`id`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [model/Model.ts:414](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L414)

Delete a record by its primary key

#### Parameters

##### id

Primary key value

`string` | `number`

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Promise that resolves to query result

***

### toRecord()

> **toRecord**(): `Record`\<`string`, `any`\>

Defined in: [model/Model.ts:364](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L364)

Convert the model instance to a database record

#### Returns

`Record`\<`string`, `any`\>

Record with column names and values

***

### save()

> **save**(`options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [model/Model.ts:385](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L385)

Save the model to the database

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Promise that resolves to query result

***

### delete()

> **delete**(`options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [model/Model.ts:435](https://github.com/iarayan/ch-orm/blob/main/src/model/Model.ts#L435)

Delete the current model instance from the database

#### Parameters

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Promise that resolves to query result
