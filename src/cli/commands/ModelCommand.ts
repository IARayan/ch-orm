import * as fs from "fs";
import * as path from "path";

/**
 * Command for creating a new model file
 */
export class ModelCommand {
  /**
   * Path to models directory
   */
  private modelsDir: string;

  /**
   * Template for model files
   */
  private template = `import { Model, Table, Column, PrimaryKey, DateTimeColumn } from 'ch-orm';

@Table('{tableName}')
export default class {name} extends Model {
  @PrimaryKey()
  id: string;

  @DateTimeColumn({ defaultExpression: 'now()' })
  created_at: Date;

  // Add your columns here
  // @Column()
  // name: string;
}
`;

  /**
   * Create a new ModelCommand instance
   * @param modelsDir - Path to models directory
   */
  constructor(modelsDir: string = "./src/models") {
    this.modelsDir = modelsDir;
  }

  /**
   * Set the path to the models directory
   * @param dir - Models directory path
   */
  public setModelsDir(dir: string): void {
    this.modelsDir = dir;
  }

  /**
   * Execute the command to create a model file
   * @param name - Model name
   * @returns Path to the created model file
   */
  public execute(name: string): string {
    // Ensure models directory exists
    this.ensureModelsDir();

    // Generate class name from model name
    const className = this.generateClassName(name);

    // Generate table name from model name
    const tableName = this.generateTableName(name);

    // Generate filename for the model
    const filename = `${className}.ts`;

    // Create model content from template
    const content = this.template
      .replace("{name}", className)
      .replace("{tableName}", tableName);

    // Write model file
    const filePath = path.join(this.modelsDir, filename);
    fs.writeFileSync(filePath, content);

    return filePath;
  }

  /**
   * Ensure models directory exists
   */
  private ensureModelsDir(): void {
    if (!fs.existsSync(this.modelsDir)) {
      fs.mkdirSync(this.modelsDir, { recursive: true });
    }
  }

  /**
   * Generate a class name from model name
   * @param name - Model name
   * @returns Class name in PascalCase
   */
  private generateClassName(name: string): string {
    return name
      .split(/[_\-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
  }

  /**
   * Generate a table name from model name
   * @param name - Model name
   * @returns Table name
   */
  private generateTableName(name: string): string {
    return name.toLowerCase();
  }
}
