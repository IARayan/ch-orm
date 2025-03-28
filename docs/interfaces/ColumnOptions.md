[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / ColumnOptions

# Interface: ColumnOptions

Defined in: [decorators/ModelDecorators.ts:155](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L155)

Column decorator options

## Properties

### name?

> `optional` **name**: `string`

Defined in: [decorators/ModelDecorators.ts:159](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L159)

Column name in the database (defaults to property name)

***

### type

> **type**: `string`

Defined in: [decorators/ModelDecorators.ts:164](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L164)

Column data type

***

### primary?

> `optional` **primary**: `boolean`

Defined in: [decorators/ModelDecorators.ts:169](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L169)

Whether the column is primary key

***

### nullable?

> `optional` **nullable**: `boolean`

Defined in: [decorators/ModelDecorators.ts:174](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L174)

Whether the column is nullable

***

### defaultExpression?

> `optional` **defaultExpression**: `string`

Defined in: [decorators/ModelDecorators.ts:179](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L179)

Default value expression

***

### comment?

> `optional` **comment**: `string`

Defined in: [decorators/ModelDecorators.ts:184](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L184)

Comment for the column

***

### codec?

> `optional` **codec**: `string`

Defined in: [decorators/ModelDecorators.ts:189](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L189)

Codec to use for column compression

***

### ttl?

> `optional` **ttl**: `string`

Defined in: [decorators/ModelDecorators.ts:194](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L194)

TTL expression for the column
