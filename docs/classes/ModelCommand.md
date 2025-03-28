[**CH-ORM Documentation v1.3.4**](../README.md)

***

[CH-ORM Documentation](../globals.md) / ModelCommand

# Class: ModelCommand

Defined in: [cli/commands/ModelCommand.ts:7](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/ModelCommand.ts#L7)

Command for creating a new model file

## Constructors

### Constructor

> **new ModelCommand**(`modelsDir`): `ModelCommand`

Defined in: [cli/commands/ModelCommand.ts:36](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/ModelCommand.ts#L36)

Create a new ModelCommand instance

#### Parameters

##### modelsDir

`string` = `"./src/models"`

Path to models directory

#### Returns

`ModelCommand`

## Methods

### setModelsDir()

> **setModelsDir**(`dir`): `void`

Defined in: [cli/commands/ModelCommand.ts:44](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/ModelCommand.ts#L44)

Set the path to the models directory

#### Parameters

##### dir

`string`

Models directory path

#### Returns

`void`

***

### execute()

> **execute**(`name`): `string`

Defined in: [cli/commands/ModelCommand.ts:53](https://github.com/iarayan/ch-orm/blob/main/src/cli/commands/ModelCommand.ts#L53)

Execute the command to create a model file

#### Parameters

##### name

`string`

Model name

#### Returns

`string`

Path to the created model file
