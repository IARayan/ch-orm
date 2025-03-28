[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / NullableColumn

# Function: NullableColumn()

> **NullableColumn**(`subType`, `options`): `PropertyDecorator`

Defined in: [decorators/ModelDecorators.ts:429](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L429)

Nullable column decorator

## Parameters

### subType

`string`

Base type

### options

`Partial`\<`Omit`\<[`ColumnOptions`](../interfaces/ColumnOptions.md), `"type"` \| `"nullable"`\>\> = `{}`

Column options (optional)

## Returns

`PropertyDecorator`

Property decorator
