[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / Connection

# Class: Connection

Defined in: [connection/Connection.ts:16](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L16)

Connection class for managing connections to a ClickHouse server
Handles query execution and manages connection state

## Constructors

### Constructor

> **new Connection**(`config`): `Connection`

Defined in: [connection/Connection.ts:43](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L43)

Create a new ClickHouse connection

#### Parameters

##### config

`Partial`\<[`ConnectionConfig`](../interfaces/ConnectionConfig.md)\>

Connection configuration

#### Returns

`Connection`

## Methods

### query()

> **query**\<`T`\>(`sql`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`T`\>\>

Defined in: [connection/Connection.ts:69](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L69)

Execute a raw SQL query

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### sql

`string`

SQL query to execute

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`T`\>\>

Query result

***

### execute()

> **execute**\<`T`\>(`sql`, `params`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`T`\>\>

Defined in: [connection/Connection.ts:149](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L149)

Execute a parameterized query with values

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### sql

`string`

SQL query with placeholders (?)

##### params

`any`[] = `[]`

Parameter values

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`T`\>\>

Query result

***

### insert()

> **insert**\<`T`\>(`table`, `data`, `options`?): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`T`\>\>

Defined in: [connection/Connection.ts:171](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L171)

Execute a simple INSERT query

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### table

`string`

Table name

##### data

Data to insert (object or array of objects)

`Record`\<`string`, `any`\> | `Record`\<`string`, `any`\>[]

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)

Query options

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`T`\>\>

Query result

***

### ping()

> **ping**(): `Promise`\<`boolean`\>

Defined in: [connection/Connection.ts:303](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L303)

Ping the ClickHouse server to test the connection

#### Returns

`Promise`\<`boolean`\>

True if connected successfully

***

### serverInfo()

> **serverInfo**(): `Promise`\<`any`\>

Defined in: [connection/Connection.ts:316](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L316)

Get information about the ClickHouse server

#### Returns

`Promise`\<`any`\>

Server information

***

### listDatabases()

> **listDatabases**(): `Promise`\<`string`[]\>

Defined in: [connection/Connection.ts:325](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L325)

List databases on the ClickHouse server

#### Returns

`Promise`\<`string`[]\>

Array of database names

***

### listTables()

> **listTables**(): `Promise`\<`string`[]\>

Defined in: [connection/Connection.ts:334](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L334)

List tables in the current database

#### Returns

`Promise`\<`string`[]\>

Array of table names

***

### describeTable()

> **describeTable**(`table`): `Promise`\<`any`[]\>

Defined in: [connection/Connection.ts:344](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L344)

Get table schema information

#### Parameters

##### table

`string`

Table name

#### Returns

`Promise`\<`any`[]\>

Table schema information

***

### createDatabase()

> **createDatabase**(`database`): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [connection/Connection.ts:354](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L354)

Create a new database

#### Parameters

##### database

`string`

Database name

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Query result

***

### dropDatabase()

> **dropDatabase**(`database`): `Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Defined in: [connection/Connection.ts:363](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L363)

Drop a database

#### Parameters

##### database

`string`

Database name

#### Returns

`Promise`\<[`QueryResult`](../interfaces/QueryResult.md)\<`any`\>\>

Query result

***

### getConfig()

> **getConfig**(): [`ConnectionConfig`](../interfaces/ConnectionConfig.md)

Defined in: [connection/Connection.ts:371](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L371)

Get the current connection configuration

#### Returns

[`ConnectionConfig`](../interfaces/ConnectionConfig.md)

Connection configuration

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [connection/Connection.ts:378](https://github.com/iarayan/ch-orm/blob/main/src/connection/Connection.ts#L378)

Close the connection and release resources

#### Returns

`Promise`\<`void`\>
