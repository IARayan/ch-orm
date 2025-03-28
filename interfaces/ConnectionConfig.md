[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / ConnectionConfig

# Interface: ConnectionConfig

Defined in: [types/connection.ts:4](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L4)

Connection configuration options for ClickHouse database

## Properties

### host

> **host**: `string`

Defined in: [types/connection.ts:9](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L9)

ClickHouse server hostname

#### Default

```ts
'localhost'
```

***

### port

> **port**: `number`

Defined in: [types/connection.ts:15](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L15)

ClickHouse server port

#### Default

```ts
8123
```

***

### database

> **database**: `string`

Defined in: [types/connection.ts:21](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L21)

Database name to connect to

#### Default

```ts
'default'
```

***

### username

> **username**: `string`

Defined in: [types/connection.ts:27](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L27)

Username for authentication

#### Default

```ts
'default'
```

***

### password

> **password**: `string`

Defined in: [types/connection.ts:33](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L33)

Password for authentication

#### Default

```ts
''
```

***

### protocol?

> `optional` **protocol**: `"http"` \| `"https"`

Defined in: [types/connection.ts:39](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L39)

Protocol to use for connection (http or https)

#### Default

```ts
'http'
```

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [types/connection.ts:45](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L45)

Connection timeout in milliseconds

#### Default

```ts
30000
```

***

### maxConnections?

> `optional` **maxConnections**: `number`

Defined in: [types/connection.ts:51](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L51)

Maximum number of connections in the pool

#### Default

```ts
10
```

***

### debug?

> `optional` **debug**: `boolean`

Defined in: [types/connection.ts:57](https://github.com/iarayan/ch-orm/blob/main/src/types/connection.ts#L57)

Enable debug mode for logging

#### Default

```ts
false
```
