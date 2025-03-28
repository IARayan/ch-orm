[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / HasMany

# Class: HasMany\<T, R\>

Defined in: [relationships/ModelRelationships.ts:208](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L208)

HasMany relationship
Represents a one-to-many relationship from the owner model to the related model

## Extends

- [`Relationship`](Relationship.md)\<`T`, `R`\>

## Type Parameters

### T

`T` *extends* [`Model`](Model.md)

### R

`R` *extends* [`Model`](Model.md)

## Constructors

### Constructor

> **new HasMany**\<`T`, `R`\>(`ownerModel`, `relatedModelClass`, `foreignKey`, `localKey`?): `HasMany`\<`T`, `R`\>

Defined in: [relationships/ModelRelationships.ts:224](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L224)

Constructor for HasMany relationship

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

`HasMany`\<`T`, `R`\>

#### Overrides

[`Relationship`](Relationship.md).[`constructor`](Relationship.md#constructor)

## Methods

### get()

> **get**(): `Promise`\<`R`[]\>

Defined in: [relationships/ModelRelationships.ts:237](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L237)

Get the related records

#### Returns

`Promise`\<`R`[]\>

#### Overrides

[`Relationship`](Relationship.md).[`get`](Relationship.md#get)

***

### eagerLoad()

> **eagerLoad**(`models`): `Promise`\<`Map`\<`any`, `R`[]\>\>

Defined in: [relationships/ModelRelationships.ts:248](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L248)

Eager load related records for a collection of models

#### Parameters

##### models

`T`[]

#### Returns

`Promise`\<`Map`\<`any`, `R`[]\>\>

#### Overrides

[`Relationship`](Relationship.md).[`eagerLoad`](Relationship.md#eagerload)
