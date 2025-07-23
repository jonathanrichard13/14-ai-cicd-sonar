import express from 'express';
import request from 'supertest';
import { getWeatherForCity } from '../source/weatherService';

// Create Express app
const app = express();

// Add route handler
app.get('/api/weather/:city', async (req, res) => {
  try {
    const weather = await getWeatherForCity(req.params.city);
    res.json(weather);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

jest.mock('../source/database', () => ({
  getDb: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' })
    })
  }),
  executeQuery: jest.fn().mockResolvedValue([])
}));

describe('Weather API Routes', () => {
  describe('GET /api/weather/:city', () => {
    it('should return weather data for a valid city', async () => {
      // Act
      const response = await request(app)
        .get('/api/weather/Jakarta')
        .expect('Content-Type', /json/)
        .expect(200);

      // Assert
      expect(response.body).toBeDefined();
      expect(response.body.city).toBe('Jakarta');
      expect(response.body.temperature).toBeDefined();
      expect(response.body.conditions).toBeDefined();
    });
  });
});
