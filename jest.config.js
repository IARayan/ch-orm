/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  rootDir: ".",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  verbose: true,
  setupFilesAfterEnv: ["./__tests__/setup.ts"],
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,
};
