import { getWeatherForCity } from '../source/weatherService';

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
      if (typeof result === 'object' && result !== null) {
        expect(result.city).toBe('Jakarta');
        expect(result.temperature).toBeDefined();
        expect(result.conditions).toBeDefined();
      }
    });

    it('should handle invalid city names', async () => {
      // Act & Assert
      await expect(getWeatherForCity('error')).rejects.toThrow();
    });

    it('should handle empty city names', async () => {
      // Act & Assert
      await expect(getWeatherForCity('')).rejects.toThrow();
    });
  });
});
