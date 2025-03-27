import * as fs from "fs";
import * as path from "path";
import { Connection } from "../../connection/Connection";

/**
 * Command for seeding the database
 */
export class SeederCommand {
  private connection: Connection;
  private seedersDir: string;

  constructor(connection: Connection, seedersDir: string = "./seeders") {
    this.connection = connection;
    this.seedersDir = seedersDir;
  }

  /**
   * Run all seeders
   */
  public async run(): Promise<void> {
    const seeders = this.getSeeders();

    for (const seeder of seeders) {
      await this.runSeeder(seeder);
    }
  }

  /**
   * Run a specific seeder
   */
  private async runSeeder(seederFile: string): Promise<void> {
    const seederPath = path.join(this.seedersDir, seederFile);
    const seeder = require(seederPath).default;
    const instance = new seeder(this.connection);

    if (typeof instance.run !== "function") {
      throw new Error(`Seeder ${seederFile} must implement a run method`);
    }

    await instance.run();
  }

  /**
   * Get all seeder files
   */
  private getSeeders(): string[] {
    if (!fs.existsSync(this.seedersDir)) {
      return [];
    }

    return fs
      .readdirSync(this.seedersDir)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
      .sort();
  }

  /**
   * Create a new seeder file
   */
  public createSeeder(name: string): string {
    const template = `import { Seeder } from '@iarayan/ch-orm';

export default class ${name}Seeder implements Seeder {
  constructor(private connection: any) {}

  public async run(): Promise<void> {
    // Add your seeding logic here
    await this.connection.query(\`
      -- Your seeding SQL here
    \`);
  }
}
`;

    if (!fs.existsSync(this.seedersDir)) {
      fs.mkdirSync(this.seedersDir, { recursive: true });
    }

    const timestamp = new Date().getTime();
    const filename = `${timestamp}_${name.toLowerCase()}_seeder.ts`;
    const filePath = path.join(this.seedersDir, filename);

    fs.writeFileSync(filePath, template);
    return filePath;
  }
}
