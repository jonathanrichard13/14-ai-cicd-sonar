// Jest setup file for global types and configurations
import '@types/jest';

// Extend Jest matchers if needed
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefined(): R;
      toBe(expected: any): R;
      toThrow(): R;
    }
  }
}
