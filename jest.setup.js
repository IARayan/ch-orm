// Extend the Jest timeout for longer-running tests
jest.setTimeout(10000);

// Suppress console.log during tests
global.console.log = jest.fn();

// Add any global setup for tests here

// Add custom matchers if needed in the future
// expect.extend({...});
