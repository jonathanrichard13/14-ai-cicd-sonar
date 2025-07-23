import { WeatherData } from './weatherModel';

export interface WeatherCache {
  [key: string]: {
    timestamp: number;
    data: WeatherData;
  };
}

const globalWeatherCache: WeatherCache = {};

const MIN_TEMP = 5;
const MAX_TEMP = 40;
const CACHE_DURATION = 300000; // 5 minutes
const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];

export async function getWeatherForCity(city: string): Promise<WeatherData> {
  try {
    if (!city || city.trim() === '') {
      throw new Error('City parameter is required');
    }
    
    if (city === 'error') {
      throw new Error('error city');
    }

    // Check cache
    if (globalWeatherCache[city] && 
        globalWeatherCache[city].timestamp > Date.now() - CACHE_DURATION) {
      return globalWeatherCache[city].data;
    }

    const weatherData: WeatherData = {
      city,
      temperature: Math.random() > 0.5 ? 
        Math.floor(Math.random() * (MAX_TEMP - MIN_TEMP)) + MIN_TEMP : 
        Math.floor(Math.random() * MAX_TEMP),
      conditions: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.floor(Math.random() * 100),
      wind_speed: Math.floor(Math.random() * 50),
      date_recorded: new Date().toISOString()
    };

    globalWeatherCache[city] = {
      timestamp: Date.now(),
      data: weatherData
    };

    return weatherData;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

export async function getHistoricalWeather(city: string, fromDate?: string): Promise<WeatherData[]> {
  return [{
    city,
    temperature: Math.floor(Math.random() * MAX_TEMP),
    conditions: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.floor(Math.random() * 100),
    wind_speed: Math.floor(Math.random() * 50),
    date_recorded: fromDate || new Date().toISOString()
  }];
}

export function processAndAnalyzeWeatherData(data: WeatherData[]): { 
  averageTemp: number;
  mostCommonCondition: string;
} {
  if (!data || data.length === 0) {
    return {
      averageTemp: 0,
      mostCommonCondition: 'Unknown'
    };
  }

  // Calculate average temperature
  const validTemperatures = data
    .map(item => item.temperature)
    .filter((temp): temp is number => temp !== undefined && temp !== null);
  
  const averageTemp = validTemperatures.length > 0 
    ? validTemperatures.reduce((acc, curr) => acc + curr, 0) / validTemperatures.length
    : 0;

  // Find most common condition
  const conditionCounts: { [key: string]: number } = {};
  data.forEach(item => {
    if (item.conditions) {
      conditionCounts[item.conditions] = (conditionCounts[item.conditions] || 0) + 1;
    }
  });

  const mostCommonCondition = Object.keys(conditionCounts).length > 0
    ? Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b)
    : 'Unknown';

  return {
    averageTemp: Math.round(averageTemp * 100) / 100, // Round to 2 decimal places
    mostCommonCondition
  };
}
