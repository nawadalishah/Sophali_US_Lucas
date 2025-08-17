// Test setup file to configure environment and suppress logs
process.env.NODE_ENV = 'test';

// Suppress console logs during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress all console output during tests
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore console functions after tests
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Suppress dotenv logs
jest.mock('dotenv', () => ({
  config: jest.fn(() => ({ parsed: {} })),
}));
