[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / ManyToMany

# Class: ManyToMany\<T, R\>

Defined in: [relationships/ModelRelationships.ts:366](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L366)

ManyToMany relationship
Represents a many-to-many relationship through a pivot table

## Extends

- [`Relationship`](Relationship.md)\<`T`, `R`\>

## Type Parameters

### T

`T` *extends* [`Model`](Model.md)

### R

`R` *extends* [`Model`](Model.md)

## Constructors

### Constructor

> **new ManyToMany**\<`T`, `R`\>(`ownerModel`, `relatedModelClass`, `pivotTable`, `foreignPivotKey`, `relatedPivotKey`, `localKey`?, `relatedKey`?): `ManyToMany`\<`T`, `R`\>

Defined in: [relationships/ModelRelationships.ts:395](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L395)

Constructor for ManyToMany relationship

#### Parameters

##### ownerModel

`T`

The model instance that owns this relationship

##### relatedModelClass

() => `R`

The related model class

##### pivotTable

`string`

The pivot table name

##### foreignPivotKey

`string`

The foreign key on the pivot table for the owner model

##### relatedPivotKey

`string`

The foreign key on the pivot table for the related model

##### localKey?

`string`

The local key on the owner model (default: primary key)

##### relatedKey?

`string`

The local key on the related model (default: primary key)

#### Returns

`ManyToMany`\<`T`, `R`\>

#### Overrides

[`Relationship`](Relationship.md).[`constructor`](Relationship.md#constructor)

## Methods

### get()

> **get**(): `Promise`\<`R`[]\>

Defined in: [relationships/ModelRelationships.ts:414](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L414)

Get the related records

#### Returns

`Promise`\<`R`[]\>

#### Overrides

[`Relationship`](Relationship.md).[`get`](Relationship.md#get)

***

### eagerLoad()

> **eagerLoad**(`models`): `Promise`\<`Map`\<`any`, `R`[]\>\>

Defined in: [relationships/ModelRelationships.ts:431](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L431)

Eager load related records for a collection of models

#### Parameters

##### models

`T`[]

#### Returns

`Promise`\<`Map`\<`any`, `R`[]\>\>

#### Overrides

[`Relationship`](Relationship.md).[`eagerLoad`](Relationship.md#eagerload)

***

### attach()

> **attach**(`relatedIds`): `Promise`\<`void`\>

Defined in: [relationships/ModelRelationships.ts:470](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L470)

Attach related models to the owner model

#### Parameters

##### relatedIds

`any`

IDs of related models to attach

#### Returns

`Promise`\<`void`\>

***

### detach()

> **detach**(`relatedIds`?): `Promise`\<`void`\>

Defined in: [relationships/ModelRelationships.ts:491](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L491)

Detach related models from the owner model

#### Parameters

##### relatedIds?

`any`

Optional IDs of related models to detach. Detaches all if not provided.

#### Returns

`Promise`\<`void`\>

***

### toggle()

> **toggle**(`relatedIds`): `Promise`\<`void`\>

Defined in: [relationships/ModelRelationships.ts:515](https://github.com/iarayan/ch-orm/blob/main/src/relationships/ModelRelationships.ts#L515)

Toggle the attachment status of the given related models

#### Parameters

##### relatedIds

`any`

IDs of related models to toggle

#### Returns

`Promise`\<`void`\>
