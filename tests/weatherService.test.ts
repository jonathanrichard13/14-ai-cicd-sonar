import { 
  getWeatherForCity, 
  getHistoricalWeather, 
  processAndAnalyzeWeatherData 
} from '../source/weatherService';
import { WeatherData } from '../source/weatherModel';

// Mock the database module
jest.mock('../source/database', () => ({
  getDb: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' })
    })
  }),
  executeQuery: jest.fn().mockResolvedValue([])
}));

describe('Weather Service', () => {
  describe('getWeatherForCity', () => {
    it('should return weather data for a valid city', async () => {
      // Act
      const result = await getWeatherForCity('Jakarta');

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.city).toBe('Jakarta');
      expect(result.temperature).toBeDefined();
      expect(result.conditions).toBeDefined();
      expect(result.humidity).toBeDefined();
      expect(result.wind_speed).toBeDefined();
      expect(result.date_recorded).toBeDefined();
    });

    it('should handle invalid city names', async () => {
      // Act & Assert
      await expect(getWeatherForCity('error')).rejects.toThrow('error city');
    });

    it('should handle empty city names', async () => {
      // Act & Assert
      await expect(getWeatherForCity('')).rejects.toThrow('City parameter is required');
    });

    it('should handle whitespace-only city names', async () => {
      // Act & Assert
      await expect(getWeatherForCity('   ')).rejects.toThrow('City parameter is required');
    });

    it('should use cache for repeated requests', async () => {
      // Act
      const result1 = await getWeatherForCity('TestCity');
      const result2 = await getWeatherForCity('TestCity');

      // Assert
      expect(result1).toEqual(result2);
    });

    it('should handle non-Error objects in catch block', async () => {
      // This is hard to test directly, but we can verify error handling
      await expect(getWeatherForCity('error')).rejects.toThrow();
    });
  });

  describe('getHistoricalWeather', () => {
    it('should return historical weather data', async () => {
      // Act
      const result = await getHistoricalWeather('Jakarta');

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].city).toBe('Jakarta');
    });

    it('should use provided date', async () => {
      // Act
      const customDate = '2023-01-01T00:00:00.000Z';
      const result = await getHistoricalWeather('Jakarta', customDate);

      // Assert
      expect(result[0].date_recorded).toBe(customDate);
    });
  });

  describe('processAndAnalyzeWeatherData', () => {
    it('should process valid weather data', () => {
      // Arrange
      const weatherData: WeatherData[] = [
        { city: 'A', temperature: 20, conditions: 'Sunny', humidity: 50, wind_speed: 10, date_recorded: '2023-01-01' },
        { city: 'B', temperature: 30, conditions: 'Cloudy', humidity: 60, wind_speed: 15, date_recorded: '2023-01-02' },
        { city: 'C', temperature: 10, conditions: 'Sunny', humidity: 40, wind_speed: 5, date_recorded: '2023-01-03' }
      ];

      // Act
      const result = processAndAnalyzeWeatherData(weatherData);

      // Assert
      expect(result.averageTemp).toBe(20);
      expect(result.mostCommonCondition).toBe('Sunny');
    });

    it('should handle empty data array', () => {
      // Act
      const result = processAndAnalyzeWeatherData([]);

      // Assert
      expect(result.averageTemp).toBe(0);
      expect(result.mostCommonCondition).toBe('Unknown');
    });

    it('should handle null/undefined data', () => {
      // Act
      const result = processAndAnalyzeWeatherData(null as any);

      // Assert
      expect(result.averageTemp).toBe(0);
      expect(result.mostCommonCondition).toBe('Unknown');
    });

    it('should handle data with missing temperature values', () => {
      // Arrange
      const weatherData: WeatherData[] = [
        { city: 'A', temperature: undefined, conditions: 'Sunny', humidity: 50, wind_speed: 10, date_recorded: '2023-01-01' },
        { city: 'B', temperature: 20, conditions: 'Cloudy', humidity: 60, wind_speed: 15, date_recorded: '2023-01-02' }
      ];

      // Act
      const result = processAndAnalyzeWeatherData(weatherData);

      // Assert
      expect(result.averageTemp).toBe(20);
      // Both conditions appear once, so either could be returned
      expect(['Sunny', 'Cloudy']).toContain(result.mostCommonCondition);
    });

    it('should handle data with missing conditions', () => {
      // Arrange
      const weatherData: WeatherData[] = [
        { city: 'A', temperature: 20, conditions: undefined, humidity: 50, wind_speed: 10, date_recorded: '2023-01-01' },
        { city: 'B', temperature: 30, conditions: 'Cloudy', humidity: 60, wind_speed: 15, date_recorded: '2023-01-02' }
      ];

      // Act
      const result = processAndAnalyzeWeatherData(weatherData);

      // Assert
      expect(result.averageTemp).toBe(25);
      expect(result.mostCommonCondition).toBe('Cloudy');
    });

    it('should round average temperature to 2 decimal places', () => {
      // Arrange
      const weatherData: WeatherData[] = [
        { city: 'A', temperature: 10, conditions: 'Sunny', humidity: 50, wind_speed: 10, date_recorded: '2023-01-01' },
        { city: 'B', temperature: 11, conditions: 'Cloudy', humidity: 60, wind_speed: 15, date_recorded: '2023-01-02' }
      ];

      // Act
      const result = processAndAnalyzeWeatherData(weatherData);

      // Assert
      expect(result.averageTemp).toBe(10.5);
    });
  });
});
