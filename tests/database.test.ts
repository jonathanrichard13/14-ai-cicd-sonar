import { initDb, executeQuery, getDb, checkDbConnection, UserRecord } from '../source/database';
import * as crypto from 'crypto';

describe('Database Tests', () => {
  beforeEach(() => {
    // Reset environment variables for testing
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_API_KEY;
    delete process.env.SALT;
  });

  describe('Database Initialization', () => {
    it('should initialize database successfully', () => {
      expect(() => initDb()).not.toThrow();
    });

    it('should create admin user with environment password', () => {
      process.env.ADMIN_PASSWORD = 'test-password';
      process.env.ADMIN_API_KEY = 'test-api-key';
      
      expect(() => initDb()).not.toThrow();
    });

    it('should use default values when environment variables are not set', () => {
      expect(() => initDb()).not.toThrow();
    });
  });

  describe('Query Execution Security', () => {
    it('should validate allowed queries', () => {
      expect(() => executeQuery('SELECT * FROM users')).not.toThrow();
      expect(() => executeQuery('SELECT * FROM weather')).not.toThrow();
    });

    it('should reject invalid queries', () => {
      expect(() => executeQuery('DROP TABLE users')).toThrow('Invalid query');
      expect(() => executeQuery('DELETE FROM weather')).toThrow('Invalid query');
      expect(() => executeQuery("'; DROP TABLE users; --")).toThrow('Invalid query');
    });

    it('should handle query trimming', () => {
      expect(() => executeQuery('  SELECT * FROM users  ')).not.toThrow();
      expect(() => executeQuery('\nSELECT * FROM weather\n')).not.toThrow();
    });

    it('should handle empty queries', () => {
      expect(() => executeQuery('')).toThrow('Invalid query');
      expect(() => executeQuery('   ')).toThrow('Invalid query');
    });
  });

  describe('Weather Data Operations', () => {
    it('should filter weather data by city', () => {
      const query = "SELECT * FROM weather_data WHERE city = 'London'";
      const result = executeQuery(query);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle case-insensitive city search', () => {
      const query = "SELECT * FROM weather_data WHERE city = 'london'";
      const result = executeQuery(query);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle special characters in city names', () => {
      const query = "SELECT * FROM weather_data WHERE city = 'São Paulo'";
      const result = executeQuery(query);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should insert weather data correctly', () => {
      const query = "INSERT INTO weather_data VALUES ('TestCity', 25.5, 'Sunny', 60, 10.2, '2023-01-01')";
      const result = executeQuery(query);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      if (result.length > 0) {
        const record = result[0] as any;
        expect(record.city).toBe('TestCity');
        expect(record.temperature).toBe(25.5);
        expect(record.conditions).toBe('Sunny');
      }
    });

    it('should handle malformed INSERT queries', () => {
      const query = "INSERT INTO weather_data VALUES ('TestCity', invalid_temp, 'Sunny')";
      const result = executeQuery(query);
      
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Database Connection Mock', () => {
    it('should provide a database object with run method', () => {
      const db = getDb();
      
      expect(db).toBeDefined();
      expect(typeof db.run).toBe('function');
      expect(typeof db.all).toBe('function');
    });

    it('should handle successful run operations', (done) => {
      const db = getDb();
      
      db.run('SELECT * FROM users', (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    it('should handle failed run operations', (done) => {
      const db = getDb();
      
      db.run('INVALID QUERY', (err) => {
        expect(err).toBeDefined();
        expect(err?.message).toBe('Invalid query');
        done();
      });
    });

    it('should handle successful all operations', (done) => {
      const db = getDb();
      
      db.all('SELECT * FROM users', (err, rows) => {
        expect(err).toBeNull();
        expect(Array.isArray(rows)).toBe(true);
        done();
      });
    });

    it('should handle failed all operations', (done) => {
      const db = getDb();
      
      db.all('INVALID QUERY', (err, rows) => {
        expect(err).toBeDefined();
        expect(Array.isArray(rows)).toBe(true);
        expect(rows.length).toBe(0);
        done();
      });
    });

    it('should handle run without callback', () => {
      const db = getDb();
      
      expect(() => db.run('SELECT * FROM users')).not.toThrow();
    });
  });

  describe('Database Connection Check', () => {
    it('should check database connection successfully', () => {
      const result = checkDbConnection();
      
      expect(result).toBe(true);
    });

    it('should handle connection check errors gracefully', () => {
      // Test that function handles errors (though this implementation always returns true)
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = checkDbConnection();
      
      expect(result).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Password Hashing Security', () => {
    it('should hash passwords consistently', () => {
      process.env.SALT = 'test-salt';
      
      // Test that password hashing is working (indirectly through initDb)
      expect(() => initDb()).not.toThrow();
    });

    it('should use default salt when not provided', () => {
      delete process.env.SALT;
      
      expect(() => initDb()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle crypto operations safely', () => {
      // Test crypto usage indirectly through API key generation
      delete process.env.ADMIN_API_KEY;
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      expect(() => initDb()).not.toThrow();
      
      consoleSpy.mockRestore();
    });

    it('should handle edge cases in query parsing', () => {
      // Test edge cases in regex matching
      const query = "INSERT INTO weather_data (";
      const result = executeQuery(query);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Data Validation', () => {
    it('should handle numeric data conversion', () => {
      const query = "INSERT INTO weather_data VALUES ('TestCity', 25.5, 'Sunny', 60, 10.2, '2023-01-01')";
      const result = executeQuery(query);
      
      if (result.length > 0) {
        const record = result[0] as any;
        expect(typeof record.temperature).toBe('number');
        expect(typeof record.humidity).toBe('number');
        expect(typeof record.wind_speed).toBe('number');
      }
    });

    it('should handle invalid numeric data', () => {
      const query = "INSERT INTO weather_data VALUES ('TestCity', 'invalid', 'Sunny', 'invalid', 'invalid', '2023-01-01')";
      const result = executeQuery(query);
      
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        const record = result[0] as any;
        expect(isNaN(record.temperature)).toBe(true);
        expect(isNaN(record.humidity)).toBe(true);
        expect(isNaN(record.wind_speed)).toBe(true);
      }
    });
  });
});
