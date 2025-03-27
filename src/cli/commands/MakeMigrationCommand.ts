import * as fs from "fs";
import * as path from "path";
import { generateMigrationFilename } from "../../utils/helpers";

type MigrationType = "create" | "alter" | "drop";
type ModuleSystem = "esm" | "commonjs";

interface MigrationConfig {
  moduleSystem?: ModuleSystem;
}

/**
 * Command for creating a new migration file
 */
export class MakeMigrationCommand {
  /**
   * Path to migrations directory
   */
  private migrationsDir: string;

  /**
   * Migration configuration
   */
  private config: MigrationConfig;

  /**
   * Path to the templates directory
   */
  private templatesDir: string;

  /**
   * Create a new MakeMigrationCommand instance
   * @param migrationsDir - Path to migrations directory
   * @param config - Migration configuration
   * @param templatesDir - Path to templates directory
   */
  constructor(
    migrationsDir: string = "./migrations",
    config: MigrationConfig = {},
    templatesDir: string = path.join(__dirname, "../templates/migrations")
  ) {
    this.migrationsDir = migrationsDir;
    this.config = config;
    this.templatesDir = templatesDir;
  }

  /**
   * Set the path to the migrations directory
   * @param dir - Migrations directory path
   */
  public setMigrationsDir(dir: string): void {
    this.migrationsDir = dir;
  }

  /**
   * Set the migration configuration
   * @param config - Migration configuration
   */
  public setConfig(config: MigrationConfig): void {
    this.config = config;
  }

  /**
   * Set the templates directory
   * @param dir - Templates directory path
   */
  public setTemplatesDir(dir: string): void {
    this.templatesDir = dir;
  }

  /**
   * Execute the command to create a migration file
   * @param name - Migration name
   * @returns Path to the created migration file
   */
  public execute(name: string): string {
    // Ensure migrations directory exists
    this.ensureMigrationsDir();

    // Generate class name from migration name
    const className = this.generateClassName(name);

    // Generate table name from migration name
    const tableName = this.generateTableName(name);

    // Determine migration type
    const type = this.determineMigrationType(name);

    // Determine module system
    const moduleSystem = this.detectModuleSystem();

    // Generate filename for the migration
    const filename = generateMigrationFilename(name);

    // Get template content
    const templateContent = this.getTemplateContent(moduleSystem, type);

    // Create migration content from template
    const content = templateContent
      .replace("{name}", className)
      .replace(/\{tableName\}/g, tableName);

    // Write migration file
    const filePath = path.join(this.migrationsDir, filename);
    fs.writeFileSync(filePath, content);

    return filePath;
  }

  /**
   * Get template content from a file
   * @param moduleSystem - Module system (esm or commonjs)
   * @param type - Migration type (create, alter, or drop)
   * @returns Template content
   */
  private getTemplateContent(
    moduleSystem: ModuleSystem,
    type: MigrationType
  ): string {
    const templatePath = path.join(
      this.templatesDir,
      moduleSystem,
      `${type}.txt`
    );

    try {
      return fs.readFileSync(templatePath, "utf-8");
    } catch (error) {
      throw new Error(`Template not found: ${templatePath}`);
    }
  }

  /**
   * Detect the module system being used in the project
   * @returns The detected module system
   */
  private detectModuleSystem(): ModuleSystem {
    // First check if module system is explicitly configured
    if (this.config.moduleSystem) {
      return this.config.moduleSystem;
    }

    // Then try to detect from project configuration
    // Check for package.json in the project root
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      if (packageJson.type === "module") {
        return "esm";
      }
    }

    // Check for tsconfig.json in the project root
    const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
    if (fs.existsSync(tsConfigPath)) {
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf-8"));
      if (
        tsConfig.compilerOptions?.module === "ESNext" ||
        tsConfig.compilerOptions?.module === "ES2022" ||
        tsConfig.compilerOptions?.module === "ES2020"
      ) {
        return "esm";
      }
    }

    // Default to ESM if no configuration is found
    return "esm";
  }

  /**
   * Ensure migrations directory exists
   */
  private ensureMigrationsDir(): void {
    if (!fs.existsSync(this.migrationsDir)) {
      fs.mkdirSync(this.migrationsDir, { recursive: true });
    }
  }

  /**
   * Generate a class name from migration name
   * @param name - Migration name
   * @returns Class name in PascalCase
   */
  private generateClassName(name: string): string {
    // Convert snake_case or kebab-case to PascalCase
    return name
      .split(/[_\-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
  }

  /**
   * Generate a table name from migration name
   * @param name - Migration name
   * @returns Table name
   */
  private generateTableName(name: string): string {
    // Split by common separators and remove common prefixes/suffixes
    const parts = name
      .split(/[_\-]/)
      .filter(
        (part) =>
          ![
            "create",
            "table",
            "add",
            "remove",
            "drop",
            "alter",
            "modify",
            "update",
            "delete",
            "to",
            "from",
            "in",
          ].includes(part)
      );

    // Return the last meaningful part (usually the table name)
    return parts[parts.length - 1] || name;
  }

  /**
   * Determine the type of migration from the name
   * @param name - Migration name
   * @returns Migration type
   */
  private determineMigrationType(name: string): MigrationType {
    const lowerName = name.toLowerCase();

    if (lowerName.startsWith("create_") || lowerName.startsWith("create-")) {
      return "create";
    } else if (lowerName.startsWith("drop_") || lowerName.startsWith("drop-")) {
      return "drop";
    } else if (
      lowerName.startsWith("alter_") ||
      lowerName.startsWith("alter-") ||
      lowerName.startsWith("add_") ||
      lowerName.startsWith("add-") ||
      lowerName.startsWith("remove_") ||
      lowerName.startsWith("remove-") ||
      lowerName.startsWith("modify_") ||
      lowerName.startsWith("modify-")
    ) {
      return "alter";
    }

    // Default to create if type cannot be determined
    return "create";
  }
}
