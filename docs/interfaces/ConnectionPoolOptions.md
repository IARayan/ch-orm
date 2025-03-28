[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / ConnectionPoolOptions

# Interface: ConnectionPoolOptions

Defined in: [connection/ConnectionPool.ts:7](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L7)

Options for connection pool

## Properties

### minConnections?

> `optional` **minConnections**: `number`

Defined in: [connection/ConnectionPool.ts:12](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L12)

Minimum number of connections to keep in the pool

#### Default

```ts
1
```

***

### maxConnections?

> `optional` **maxConnections**: `number`

Defined in: [connection/ConnectionPool.ts:18](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L18)

Maximum number of connections to allow in the pool

#### Default

```ts
10
```

***

### idleTimeoutMillis?

> `optional` **idleTimeoutMillis**: `number`

Defined in: [connection/ConnectionPool.ts:24](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L24)

Time in ms after which idle connections are removed from the pool

#### Default

```ts
60000 (1 minute)
```

***

### acquireTimeoutMillis?

> `optional` **acquireTimeoutMillis**: `number`

Defined in: [connection/ConnectionPool.ts:30](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L30)

Time in ms to wait for a connection to become available

#### Default

```ts
30000 (30 seconds)
```

***

### validateOnBorrow?

> `optional` **validateOnBorrow**: `boolean`

Defined in: [connection/ConnectionPool.ts:36](https://github.com/iarayan/ch-orm/blob/main/src/connection/ConnectionPool.ts#L36)

Whether to validate connections before returning them

#### Default

```ts
true
```
