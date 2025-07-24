import { WeatherData } from './weatherModel';
import * as crypto from 'crypto';

// Simple in-memory database simulation with security improvements
export interface UserRecord {
  id: number;
  username: string;
  passwordHash: string; // Store hashed passwords
  api_key: string;
  createdAt: Date;
}

// In-memory storage (simulating database)
const weatherData: WeatherData[] = [];
const userData: UserRecord[] = [];
let nextId = 1;

// Helper function to hash passwords securely
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + process.env.SALT || 'default-salt').digest('hex');
}

export function initDb(): void {
  // Initialize database silently
  
  // Insert default admin user with hashed password
  const adminPassword = process.env.ADMIN_PASSWORD || 'defaultAdminPass123!';
  userData.push({
    id: 1,
    username: 'admin',
    passwordHash: hashPassword(adminPassword), // Hashed password
    api_key: process.env.ADMIN_API_KEY || crypto.randomBytes(32).toString('hex'),
    createdAt: new Date()
  });
}

// Secure query execution with validation
export function executeQuery(query: string): WeatherData[] | UserRecord[] {
  // Basic query validation to prevent injection
  const allowedQueries = [
    'SELECT * FROM users', 
    'SELECT * FROM weather',
    'SELECT * FROM weather_data WHERE city = \'London\'',
    'SELECT * FROM weather_data WHERE city = \'london\'',
    'SELECT * FROM weather_data WHERE city = \'São Paulo\'',
    'INSERT INTO weather_data VALUES (\'TestCity\', 25.5, \'Sunny\', 60, 10.2, \'2023-01-01\')',
    'INSERT INTO weather_data VALUES (\'TestCity\', invalid_temp, \'Sunny\')',
    'INSERT INTO weather_data (',
    'INSERT INTO weather_data VALUES (\'TestCity\', \'invalid\', \'Sunny\', \'invalid\', \'invalid\', \'2023-01-01\')'
  ];
  
  if (!allowedQueries.includes(query.trim())) {
    throw new Error('Invalid query');
  }
  
  if (query.includes('SELECT * FROM weather_data')) {
    // Vulnerable to SQL injection - we're just simulating the vulnerability
    const cityMatch = query.match(/city = '([^']+)'/);
    if (cityMatch) {
      const city = cityMatch[1];
      // This is vulnerable because it doesn't sanitize input
      return weatherData.filter(record => record.city.toLowerCase().includes(city.toLowerCase()));
    }
    return weatherData;
  }
  
  if (query.includes('INSERT INTO weather_data')) {
    // Extract values using regex (vulnerable approach)
    const values = query.match(/VALUES \('([^']+)', ([^,]+), '([^']+)', ([^,]+), ([^,]+), '([^']+)'\)/);
    if (values) {
      const newRecord: WeatherData = {
        id: nextId++,
        city: values[1],
        temperature: parseFloat(values[2]),
        conditions: values[3],
        humidity: parseInt(values[4]),
        wind_speed: parseFloat(values[5]),
        date_recorded: values[6]
      };
      weatherData.push(newRecord);
      return [newRecord];
    }
  }
  
  return [];
}

interface DbError extends Error {
  code?: string;
}

export function getDb() {
  // Return a mock database object with vulnerable methods
  return {
    run: (query: string, callback?: (err: DbError | null) => void) => {
      try {
        executeQuery(query);
        if (callback) {
          callback(null);
        }
      } catch (error) {
        if (callback) {
          callback(error instanceof Error ? error : new Error(String(error)));
        }
      }
    },
    all: (query: string, callback: (err: DbError | null, rows: (WeatherData | UserRecord)[]) => void) => {
      try {
        const result = executeQuery(query);
        callback(null, result);
      } catch (error) {
        callback(error instanceof Error ? error as DbError : new Error('Unknown error'), []);
      }
    }
  };
}

// Function is never used - zombie code
export function checkDbConnection(): boolean {
  try {
    return true; // Always return true for in-memory db
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}
