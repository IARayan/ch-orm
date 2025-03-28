[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / MakeMigrationCommand

# Class: MakeMigrationCommand

Defined in: [cli/commands/MakeMigrationCommand.ts:15](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MakeMigrationCommand.ts#L15)

Command for creating a new migration file

## Constructors

### Constructor

> **new MakeMigrationCommand**(`migrationsDir`, `config`, `templatesDir`): `MakeMigrationCommand`

Defined in: [cli/commands/MakeMigrationCommand.ts:37](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MakeMigrationCommand.ts#L37)

Create a new MakeMigrationCommand instance

#### Parameters

##### migrationsDir

`string` = `"./migrations"`

Path to migrations directory

##### config

`MigrationConfig` = `{}`

Migration configuration

##### templatesDir

`string` = `...`

Path to templates directory

#### Returns

`MakeMigrationCommand`

## Methods

### setMigrationsDir()

> **setMigrationsDir**(`dir`): `void`

Defined in: [cli/commands/MakeMigrationCommand.ts:51](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MakeMigrationCommand.ts#L51)

Set the path to the migrations directory

#### Parameters

##### dir

`string`

Migrations directory path

#### Returns

`void`

***

### setConfig()

> **setConfig**(`config`): `void`

Defined in: [cli/commands/MakeMigrationCommand.ts:59](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MakeMigrationCommand.ts#L59)

Set the migration configuration

#### Parameters

##### config

`MigrationConfig`

Migration configuration

#### Returns

`void`

***

### setTemplatesDir()

> **setTemplatesDir**(`dir`): `void`

Defined in: [cli/commands/MakeMigrationCommand.ts:67](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MakeMigrationCommand.ts#L67)

Set the templates directory

#### Parameters

##### dir

`string`

Templates directory path

#### Returns

`void`

***

### execute()

> **execute**(`name`): `string`

Defined in: [cli/commands/MakeMigrationCommand.ts:76](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/MakeMigrationCommand.ts#L76)

Execute the command to create a migration file

#### Parameters

##### name

`string`

Migration name

#### Returns

`string`

Path to the created migration file
