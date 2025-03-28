[**CH-ORM Documentation v1.3.5**](../README.md)

***

[CH-ORM Documentation](../globals.md) / MetadataStorage

# Variable: MetadataStorage

> `const` **MetadataStorage**: `object`

Defined in: [decorators/ModelDecorators.ts:19](https://github.com/iarayan/ch-orm/blob/main/src/decorators/ModelDecorators.ts#L19)

Storage for metadata about models and their columns

## Type declaration

### tables

> **tables**: `Map`\<`Function`, `string`\>

Map of model constructors to table names

### primaryKeys

> **primaryKeys**: `Map`\<`Function`, `string`[]\>

Map of model constructors to primary key column names

### columns

> **columns**: `Map`\<`Function`, `Map`\<`string`, [`ColumnMetadata`](../interfaces/ColumnMetadata.md)\>\>

Map of model constructors to column definitions

### getTableName()

Get table name for a model

#### Parameters

##### target

`Function`

Model constructor

#### Returns

`undefined` \| `string`

Table name or undefined if not set

### setTableName()

Set table name for a model

#### Parameters

##### target

`Function`

Model constructor

##### name

`string`

Table name

#### Returns

`void`

### getPrimaryKeys()

Get primary keys for a model

#### Parameters

##### target

`Function`

Model constructor

#### Returns

`string`[]

Array of primary key column names

### addPrimaryKey()

Add a primary key to a model

#### Parameters

##### target

`Function`

Model constructor

##### propertyName

`string`

Primary key property name

#### Returns

`void`

### getColumns()

Get column metadata for a model

#### Parameters

##### target

`Function`

Model constructor

#### Returns

`Map`\<`string`, [`ColumnMetadata`](../interfaces/ColumnMetadata.md)\>

Map of property names to column metadata

### addColumn()

Add column metadata to a model

#### Parameters

##### target

`Function`

Model constructor

##### propertyName

`string`

Property name

##### metadata

[`ColumnMetadata`](../interfaces/ColumnMetadata.md)

Column metadata

#### Returns

`void`
