[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / BelongsTo

# Class: BelongsTo\<T, R\>

Defined in: [relationships/ModelRelationships.ts:280](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L280)

BelongsTo relationship
Represents an inverse one-to-one or one-to-many relationship

## Extends

- [`Relationship`](Relationship.md)\<`T`, `R`\>

## Type Parameters

### T

`T` *extends* [`Model`](Model.md)

### R

`R` *extends* [`Model`](Model.md)

## Constructors

### Constructor

> **new BelongsTo**\<`T`, `R`\>(`ownerModel`, `relatedModelClass`, `foreignKey`, `ownerKey`?): `BelongsTo`\<`T`, `R`\>

Defined in: [relationships/ModelRelationships.ts:296](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L296)

Constructor for BelongsTo relationship

#### Parameters

##### ownerModel

`T`

The model instance that owns this relationship

##### relatedModelClass

() => `R`

The related model class

##### foreignKey

`string`

The foreign key on the owner model

##### ownerKey?

`string`

The referenced key on the related model (default: primary key)

#### Returns

`BelongsTo`\<`T`, `R`\>

#### Overrides

[`Relationship`](Relationship.md).[`constructor`](Relationship.md#constructor)

## Methods

### get()

> **get**(): `Promise`\<`R`[]\>

Defined in: [relationships/ModelRelationships.ts:314](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L314)

Get the related record

#### Returns

`Promise`\<`R`[]\>

#### Overrides

[`Relationship`](Relationship.md).[`get`](Relationship.md#get)

***

### first()

> **first**(): `Promise`\<`null` \| `R`\>

Defined in: [relationships/ModelRelationships.ts:326](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L326)

Get the first related record (convenience method)

#### Returns

`Promise`\<`null` \| `R`\>

***

### eagerLoad()

> **eagerLoad**(`models`): `Promise`\<`Map`\<`any`, `R`[]\>\>

Defined in: [relationships/ModelRelationships.ts:334](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L334)

Eager load related records for a collection of models

#### Parameters

##### models

`T`[]

#### Returns

`Promise`\<`Map`\<`any`, `R`[]\>\>

#### Overrides

[`Relationship`](Relationship.md).[`eagerLoad`](Relationship.md#eagerload)
