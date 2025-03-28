[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / Migration

# Class: `abstract` Migration

Defined in: [schema/Migration.ts:8](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L8)

Abstract base class for database migrations
Provides structure and common functionality for migrations

## Constructors

### Constructor

> **new Migration**(`connection`): `Migration`

Defined in: [schema/Migration.ts:33](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L33)

Create a new Migration instance

#### Parameters

##### connection

[`Connection`](Connection.md)

ClickHouse connection

#### Returns

`Migration`

## Properties

### name

> `readonly` **name**: `string`

Defined in: [schema/Migration.ts:22](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L22)

Migration name (derived from class name)

## Methods

### up()

> `abstract` **up**(): `Promise`\<`void`\>

Defined in: [schema/Migration.ts:43](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L43)

Abstract method to be implemented by concrete migrations for applying changes
This contains the forward migration logic

#### Returns

`Promise`\<`void`\>

***

### down()

> `abstract` **down**(): `Promise`\<`void`\>

Defined in: [schema/Migration.ts:49](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L49)

Abstract method to be implemented by concrete migrations for reverting changes
This contains the rollback migration logic

#### Returns

`Promise`\<`void`\>

***

### apply()

> **apply**(): `Promise`\<`void`\>

Defined in: [schema/Migration.ts:55](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L55)

Apply the migration

#### Returns

`Promise`\<`void`\>

Promise that resolves when the migration is applied

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [schema/Migration.ts:75](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L75)

Revert the migration

#### Returns

`Promise`\<`void`\>

Promise that resolves when the migration is reverted

***

### getName()

> **getName**(): `string`

Defined in: [schema/Migration.ts:95](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L95)

Get the migration name

#### Returns

`string`

Migration name

***

### isApplied()

> **isApplied**(): `boolean`

Defined in: [schema/Migration.ts:103](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L103)

Check if the migration has been applied

#### Returns

`boolean`

True if the migration has been applied, false otherwise

***

### setApplied()

> **setApplied**(`state`): `void`

Defined in: [schema/Migration.ts:111](https://github.com/iarayan/ch-orm/blob/main/src/schema/Migration.ts#L111)

Set the applied state of the migration

#### Parameters

##### state

`boolean`

Applied state

#### Returns

`void`
