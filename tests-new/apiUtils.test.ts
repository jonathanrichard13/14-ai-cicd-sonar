import { 
  deepClone, 
  validateExpression, 
  formatDate, 
  calculateAverageTemperature, 
  calculateMedianTemperature,
  getApiConfiguration 
} from '../source/apiUtils';

describe('apiUtils', () => {
  describe('deepClone', () => {
    it('should deep clone an object', () => {
      const original = { name: 'test', nested: { value: 42 } };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
    });

    it('should deep clone an array', () => {
      const original = [1, 2, { value: 3 }];
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('validateExpression', () => {
    it('should validate safe mathematical expressions', () => {
      expect(validateExpression('1 + 2')).toBe(true);
      expect(validateExpression('(3 * 4) - 5')).toBe(true);
      expect(validateExpression('123.45 / 6.78')).toBe(true);
    });

    it('should reject unsafe expressions', () => {
      expect(validateExpression('alert("hack")')).toBe(false);
      expect(validateExpression('console.log()')).toBe(false);
      expect(validateExpression('eval("code")')).toBe(false);
      expect(validateExpression('document.cookie')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2023-05-15');
      expect(formatDate(date)).toBe('2023-05-15');
    });

    it('should format date string correctly', () => {
      expect(formatDate('2023-12-25')).toBe('2023-12-25');
    });

    it('should handle single digit months and days', () => {
      const date = new Date('2023-01-05');
      expect(formatDate(date)).toBe('2023-01-05');
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date format');
    });
  });

  describe('calculateAverageTemperature', () => {
    it('should calculate average of temperatures', () => {
      expect(calculateAverageTemperature([10, 20, 30])).toBe(20);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageTemperature([])).toBe(0);
    });

    it('should handle negative temperatures', () => {
      expect(calculateAverageTemperature([-10, 0, 10])).toBe(0);
    });
  });

  describe('calculateMedianTemperature', () => {
    it('should calculate median for odd number of temperatures', () => {
      expect(calculateMedianTemperature([10, 20, 30])).toBe(20);
    });

    it('should calculate median for even number of temperatures', () => {
      expect(calculateMedianTemperature([10, 20, 30, 40])).toBe(25);
    });

    it('should return 0 for empty array', () => {
      expect(calculateMedianTemperature([])).toBe(0);
    });

    it('should handle unsorted temperatures', () => {
      expect(calculateMedianTemperature([30, 10, 20])).toBe(20);
    });
  });

  describe('getApiConfiguration', () => {
    it('should return null values when environment variables are not set', () => {
      const config = getApiConfiguration();
      expect(config.key).toBeNull();
      expect(config.secret).toBeNull();
    });

    it('should return environment variables when set', () => {
      process.env.API_KEY = 'test-key';
      process.env.API_SECRET = 'test-secret';
      
      const config = getApiConfiguration();
      expect(config.key).toBe('test-key');
      expect(config.secret).toBe('test-secret');
      
      // Clean up
      delete process.env.API_KEY;
      delete process.env.API_SECRET;
    });
  });
});
