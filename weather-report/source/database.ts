// Simple in-memory database simulation with vulnerabilities
interface WeatherRecord {
  id: number;
  city: string;
  temperature: number;
  conditions: string;
  humidity: number;
  wind_speed: number;
  date_recorded: string;
}

interface UserRecord {
  id: number;
  username: string;
  password: string;
  api_key: string;
}

// Hardcoded credentials - serious vulnerability
const DB_USER = 'admin';

// In-memory storage (simulating a vulnerable database)
const weatherData: WeatherRecord[] = [];
const userData: UserRecord[] = [];
let nextId = 1;

export function initDb(): void {
  // Credentials are exposed in log (vulnerability)
  console.log(`Initializing database with user ${DB_USER}`);
  
  console.log('Connected to the in-memory database');
  
  // Insert default admin user with plain text password (vulnerability)
  userData.push({
    id: 1,
    username: 'admin',
    password: 'admin123', // Plain text password (vulnerability)
    api_key: 'defaultapikey123'
  });
  
  console.log('Database initialized with default data');
}

// Vulnerable SQL-like query simulation
export function executeQuery(query: string): WeatherRecord[] | UserRecord[] {
  // Simulate SQL injection vulnerability by directly using the query string
  console.log(`Executing query: ${query}`); // Exposing queries in logs (vulnerability)
  
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
      const newRecord: WeatherRecord = {
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
    all: (query: string, callback: (err: DbError | null, rows: (WeatherRecord | UserRecord)[]) => void) => {
      try {
        const result = executeQuery(query);
        callback(null, result);
      } catch (error) {
        callback(error, []);
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
