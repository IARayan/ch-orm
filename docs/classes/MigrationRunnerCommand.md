[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / MigrationRunnerCommand

# Class: MigrationRunnerCommand

Defined in: [cli/commands/MigrationRunnerCommand.ts:10](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L10)

Command for running migrations via CLI

## Constructors

### Constructor

> **new MigrationRunnerCommand**(`connection`, `migrationsDir`): `MigrationRunnerCommand`

Defined in: [cli/commands/MigrationRunnerCommand.ts:16](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L16)

#### Parameters

##### connection

[`Connection`](Connection.md)

##### migrationsDir

`string` = `"./migrations"`

#### Returns

`MigrationRunnerCommand`

## Methods

### getCompletedMigrations()

> **getCompletedMigrations**(): `Promise`\<`string`[]\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:112](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L112)

Get all completed migrations

#### Returns

`Promise`\<`string`[]\>

***

### getMigrationsForRollback()

> **getMigrationsForRollback**(`steps`): `Promise`\<`string`[]\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:121](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L121)

Get migrations for rollback

#### Parameters

##### steps

`number` = `1`

#### Returns

`Promise`\<`string`[]\>

***

### runMigration()

> **runMigration**(`filename`): `Promise`\<`void`\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:134](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L134)

Run a specific migration

#### Parameters

##### filename

`string`

#### Returns

`Promise`\<`void`\>

***

### rollbackMigration()

> **rollbackMigration**(`filename`): `Promise`\<`void`\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:148](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L148)

Rollback a specific migration

#### Parameters

##### filename

`string`

#### Returns

`Promise`\<`void`\>

***

### getMigrationStatus()

> **getMigrationStatus**(): `Promise`\<`object`[]\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:168](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L168)

Get migration status

#### Returns

`Promise`\<`object`[]\>

***

### run()

> **run**(): `Promise`\<`void`\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:187](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L187)

Run all pending migrations

#### Returns

`Promise`\<`void`\>

***

### rollback()

> **rollback**(): `Promise`\<`void`\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:199](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L199)

Rollback migrations

#### Returns

`Promise`\<`void`\>

***

### reset()

> **reset**(): `Promise`\<`void`\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:237](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L237)

Reset the database by rolling back all migrations

#### Returns

`Promise`\<`void`\>

***

### fresh()

> **fresh**(): `Promise`\<`void`\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:263](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L263)

Fresh install - drops all database objects and runs migrations from scratch

#### Returns

`Promise`\<`void`\>

***

### refresh()

> **refresh**(): `Promise`\<`void`\>

Defined in: [cli/commands/MigrationRunnerCommand.ts:376](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MigrationRunnerCommand.ts#L376)

Refresh the database by rolling back all migrations and then running them again

#### Returns

`Promise`\<`void`\>
