import { getWeatherForCity } from '../source/weatherService';
import { WeatherData } from '../source/weatherModel';

// Mock the database module
jest.mock('../source/database', () => ({
    getDb: jest.fn(),
    executeQuery: jest.fn()
}));

jest.mock('axios');

describe('Weather Service', () => {
  describe('getWeatherForCity', () => {
    it('should return weather data for a given city', async () => {
      // Arrange
      const city = 'Jakarta';

      // Act
      const result = await getWeatherForCity(city) as WeatherData;

      // Assert
      expect(result).toBeDefined();
      expect(result.city).toBe(city);
      expect(result.temperature).toBeDefined();
      expect(typeof result.temperature).toBe('number');
      expect(result.temperature).toBeGreaterThanOrEqual(5);
      expect(result.temperature).toBeLessThanOrEqual(40);
      expect(result.conditions).toBeDefined();
      expect(['Sunny', 'Cloudy', 'Rainy', 'Stormy']).toContain(result.conditions);
      expect(result.humidity).toBeDefined();
      expect(result.humidity).toBeGreaterThanOrEqual(0);
      expect(result.humidity).toBeLessThanOrEqual(100);
      expect(result.wind_speed).toBeDefined();
      expect(result.wind_speed).toBeGreaterThanOrEqual(0);
      expect(result.wind_speed).toBeLessThanOrEqual(50);
      expect(result.date_recorded).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const city = '';

      // Act & Assert
      await expect(getWeatherForCity(city)).rejects.toThrow();
    });
  });
});
