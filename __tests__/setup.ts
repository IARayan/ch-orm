// Set high timeout for tests
jest.setTimeout(10000);

// Mock console.log and console.error to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
