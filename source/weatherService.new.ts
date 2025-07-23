import { WeatherData } from './weatherModel';

// Code smells: Global variable, hardcoded values, inconsistent error handling
interface WeatherCache {
  [key: string]: {
    timestamp: number;
    data: WeatherData;
  };
}

const globalWeatherCache: WeatherCache = {}; // Still a code smell, but typed

// Bad practice: Magic numbers, no type safety
const MIN_TEMP = 5;
const MAX_TEMP = 40;
const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];

// Code smell: Function doing too many things, inconsistent return types
export async function getWeatherForCity(city: string): Promise<WeatherData | string | null> {
  try {
    // Code smell: Console logging sensitive information
    console.log('Accessing weather for:', city);
    
    // Code smell: Unnecessary complexity with cache
    if (globalWeatherCache[city] && 
        globalWeatherCache[city].timestamp > Date.now() - 300000) {
      console.log('Cache hit');
      return globalWeatherCache[city].data;
    }

    // Code smell: Magic strings, inconsistent error handling
    if (city === '') {
      return null; // Bad practice: Inconsistent error handling
    }
    if (city === 'error') {
      throw 'error city'; // Bad practice: Throwing string
    }

    // Code smell: Complex nested ternary, magic numbers
    const weatherData = {
      city: city,
      temperature: Math.random() > 0.5 ? 
        Math.floor(Math.random() * (MAX_TEMP - MIN_TEMP)) + MIN_TEMP : 
        Math.floor(Math.random() * MAX_TEMP),
      conditions: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.floor(Math.random() * 100),
      wind_speed: Math.floor(Math.random() * 50),
      date_recorded: new Date().toISOString()
    };

    // Code smell: Mutating global state
    globalWeatherCache[city] = {
      timestamp: Date.now(),
      data: weatherData
    };

    return weatherData;
  } catch (error) {
    // Code smell: Poor error handling, mixing error types
    console.error('Failed:', error);
    return error instanceof Error ? error.message : 'Unknown error';
  }
}
