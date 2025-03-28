[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / ConnectionPool

# Class: ConnectionPool

Defined in: [connection/ConnectionPool.ts:43](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L43)

Connection pool for managing multiple ClickHouse connections
Provides automatic connection management, retry logic, and error handling

## Constructors

### Constructor

> **new ConnectionPool**(`connectionOptions`, `poolOptions`): `ConnectionPool`

Defined in: [connection/ConnectionPool.ts:101](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L101)

Create a new connection pool

#### Parameters

##### connectionOptions

[`ConnectionConfig`](../interfaces/ConnectionConfig.md)

Options for ClickHouse connections

##### poolOptions

[`ConnectionPoolOptions`](../interfaces/ConnectionPoolOptions.md) = `{}`

Options for the connection pool

#### Returns

`ConnectionPool`

## Methods

### getConnection()

> **getConnection**(): `Promise`\<[`Connection`](Connection.md)\>

Defined in: [connection/ConnectionPool.ts:139](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L139)

Get a connection from the pool

#### Returns

`Promise`\<[`Connection`](Connection.md)\>

Promise that resolves to a connection

***

### releaseConnection()

> **releaseConnection**(`connection`): `void`

Defined in: [connection/ConnectionPool.ts:187](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L187)

Release a connection back to the pool

#### Parameters

##### connection

[`Connection`](Connection.md)

Connection to release

#### Returns

`void`

***

### withConnection()

> **withConnection**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [connection/ConnectionPool.ts:281](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L281)

Execute a function with a connection from the pool

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`connection`) => `Promise`\<`T`\>

Function to execute with the connection

#### Returns

`Promise`\<`T`\>

Promise that resolves to the function's result

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [connection/ConnectionPool.ts:299](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L299)

Close all connections in the pool

#### Returns

`Promise`\<`void`\>
