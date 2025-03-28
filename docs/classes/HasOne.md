[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / HasOne

# Class: HasOne\<T, R\>

Defined in: [relationships/ModelRelationships.ts:127](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L127)

HasOne relationship
Represents a one-to-one relationship from the owner model to the related model

## Extends

- [`Relationship`](Relationship.md)\<`T`, `R`\>

## Type Parameters

### T

`T` *extends* [`Model`](Model.md)

### R

`R` *extends* [`Model`](Model.md)

## Constructors

### Constructor

> **new HasOne**\<`T`, `R`\>(`ownerModel`, `relatedModelClass`, `foreignKey`, `localKey`?): `HasOne`\<`T`, `R`\>

Defined in: [relationships/ModelRelationships.ts:143](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L143)

Constructor for HasOne relationship

#### Parameters

##### ownerModel

`T`

The model instance that owns this relationship

##### relatedModelClass

() => `R`

The related model class

##### foreignKey

`string`

The foreign key on the related model

##### localKey?

`string`

The local key (default: primary key of owner model)

#### Returns

`HasOne`\<`T`, `R`\>

#### Overrides

[`Relationship`](Relationship.md).[`constructor`](Relationship.md#constructor)

## Methods

### get()

> **get**(): `Promise`\<`R`[]\>

Defined in: [relationships/ModelRelationships.ts:156](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L156)

Get the related record

#### Returns

`Promise`\<`R`[]\>

#### Overrides

[`Relationship`](Relationship.md).[`get`](Relationship.md#get)

***

### first()

> **first**(): `Promise`\<`null` \| `R`\>

Defined in: [relationships/ModelRelationships.ts:168](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L168)

Get the first related record (convenience method)

#### Returns

`Promise`\<`null` \| `R`\>

***

### eagerLoad()

> **eagerLoad**(`models`): `Promise`\<`Map`\<`any`, `R`[]\>\>

Defined in: [relationships/ModelRelationships.ts:176](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L176)

Eager load related records for a collection of models

#### Parameters

##### models

`T`[]

#### Returns

`Promise`\<`Map`\<`any`, `R`[]\>\>

#### Overrides

[`Relationship`](Relationship.md).[`eagerLoad`](Relationship.md#eagerload)
