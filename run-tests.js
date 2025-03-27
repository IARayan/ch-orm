#!/usr/bin/env node

const { execSync } = require("child_process");
const { existsSync, readdirSync } = require("fs");
const { join } = require("path");

// Find all test files
const testFiles = [];

// Look in the __tests__ directory
const testsDir = join(__dirname, "__tests__");
if (existsSync(testsDir)) {
  function findTestFiles(dir) {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const path = join(dir, file.name);
      if (file.isDirectory()) {
        findTestFiles(path);
      } else if (file.name.endsWith(".test.ts")) {
        testFiles.push(path);
      }
    }
  }
  findTestFiles(testsDir);
}

// Add root test files if any
const rootTestFiles = readdirSync(__dirname).filter(
  (file) => file.endsWith(".test.ts") && !file.includes("node_modules")
);
rootTestFiles.forEach((file) => testFiles.push(join(__dirname, file)));

console.log(`Found ${testFiles.length} test files`);

// Run tests if any were found
if (testFiles.length > 0) {
  try {
    console.log("Running tests with ts-jest...");
    execSync(`npx jest ${testFiles.join(" ")}`, { stdio: "inherit" });
  } catch (error) {
    process.exit(1);
  }
} else {
  console.log("No test files found!");
  process.exit(1);
}
