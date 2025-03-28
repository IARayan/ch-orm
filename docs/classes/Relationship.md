[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / Relationship

# Class: `abstract` Relationship\<T, R\>

Defined in: [relationships/ModelRelationships.ts:10](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L10)

Base class for all relationship types
Provides common functionality for relationship management

## Extended by

- [`HasOne`](HasOne.md)
- [`HasMany`](HasMany.md)
- [`BelongsTo`](BelongsTo.md)
- [`ManyToMany`](ManyToMany.md)

## Type Parameters

### T

`T` *extends* [`Model`](Model.md)

### R

`R` *extends* [`Model`](Model.md)

## Constructors

### Constructor

> **new Relationship**\<`T`, `R`\>(`ownerModel`, `relatedModelClass`, `localKey`?): `Relationship`\<`T`, `R`\>

Defined in: [relationships/ModelRelationships.ts:32](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L32)

Constructor for relationship

#### Parameters

##### ownerModel

`T`

The model instance that owns this relationship

##### relatedModelClass

() => `R`

The related model class

##### localKey?

`string`

The local key (default: primary key of owner model)

#### Returns

`Relationship`\<`T`, `R`\>

## Methods

### get()

> `abstract` **get**(): `Promise`\<`R`[]\>

Defined in: [relationships/ModelRelationships.ts:115](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L115)

Abstract method to get related records

#### Returns

`Promise`\<`R`[]\>

***

### eagerLoad()

> `abstract` **eagerLoad**(`models`): `Promise`\<`Map`\<`any`, `R`[]\>\>

Defined in: [relationships/ModelRelationships.ts:120](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L120)

Abstract method to eager load related records for a collection of models

#### Parameters

##### models

`T`[]

#### Returns

`Promise`\<`Map`\<`any`, `R`[]\>\>
