[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / Relationships

# Function: Relationships()

> **Relationships**(`relationships`): `ClassDecorator`

Defined in: [relationships/ModelRelationships.ts:559](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L559)

Class decorator to register relationships for a model

## Parameters

### relationships

`Record`\<`string`, (`model`) => [`Relationship`](../classes/Relationship.md)\<`any`, `any`\>\>

Map of relationship property names to relationship definitions

## Returns

`ClassDecorator`
