[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / SeederCommand

# Class: SeederCommand

Defined in: [cli/commands/SeederCommand.ts:8](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/SeederCommand.ts#L8)

Command for seeding the database

## Constructors

### Constructor

> **new SeederCommand**(`connection`, `seedersDir`): `SeederCommand`

Defined in: [cli/commands/SeederCommand.ts:12](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/SeederCommand.ts#L12)

#### Parameters

##### connection

[`Connection`](Connection.md)

##### seedersDir

`string` = `"./seeders"`

#### Returns

`SeederCommand`

## Methods

### run()

> **run**(): `Promise`\<`void`\>

Defined in: [cli/commands/SeederCommand.ts:20](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/SeederCommand.ts#L20)

Run all seeders

#### Returns

`Promise`\<`void`\>

***

### createSeeder()

> **createSeeder**(`name`): `string`

Defined in: [cli/commands/SeederCommand.ts:60](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/SeederCommand.ts#L60)

Create a new seeder file

#### Parameters

##### name

`string`

#### Returns

`string`
