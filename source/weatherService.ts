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
const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];

export async function getWeatherForCity(city: string): Promise<WeatherData> {
  try {
    console.log('Accessing weather for:', city);
    
    if (globalWeatherCache[city] && 
        globalWeatherCache[city].timestamp > Date.now() - 300000) {
      console.log('Cache hit');
      return globalWeatherCache[city].data;
    }

    if (city === '') {
      throw new Error('City parameter is required');
    }
    if (city === 'error') {
      throw new Error('error city');
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
    console.error('Failed:', error);
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
  return {
    averageTemp: data.reduce((acc, curr) => acc + curr.temperature!, 0) / data.length,
    mostCommonCondition: data[0].conditions || 'Unknown'
  };
}
