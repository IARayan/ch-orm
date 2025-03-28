[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / ColumnMetadata

# Interface: ColumnMetadata

Defined in: [decorators/ModelDecorators.ts:105](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L105)

Interface for column metadata

## Properties

### propertyName

> **propertyName**: `string`

Defined in: [decorators/ModelDecorators.ts:109](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L109)

Property name in the model

***

### name

> **name**: `string`

Defined in: [decorators/ModelDecorators.ts:114](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L114)

Column name in the database

***

### type

> **type**: `string`

Defined in: [decorators/ModelDecorators.ts:119](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L119)

Column data type

***

### primary?

> `optional` **primary**: `boolean`

Defined in: [decorators/ModelDecorators.ts:124](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L124)

Whether the column is primary key

***

### nullable?

> `optional` **nullable**: `boolean`

Defined in: [decorators/ModelDecorators.ts:129](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L129)

Whether the column is nullable

***

### defaultExpression?

> `optional` **defaultExpression**: `string`

Defined in: [decorators/ModelDecorators.ts:134](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L134)

Default value expression

***

### comment?

> `optional` **comment**: `string`

Defined in: [decorators/ModelDecorators.ts:139](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L139)

Comment for the column

***

### codec?

> `optional` **codec**: `string`

Defined in: [decorators/ModelDecorators.ts:144](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L144)

Codec to use for column compression

***

### ttl?

> `optional` **ttl**: `string`

Defined in: [decorators/ModelDecorators.ts:149](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L149)

TTL expression for the column
