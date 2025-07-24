import request from 'supertest';
import express from 'express';
import { getWeatherForCity } from '../source/weatherService';

// Create Express app with error handling
const app = express();

// Add route handler
app.get('/api/weather/:city', async (req, res) => {
  try {
    const weather = await getWeatherForCity(req.params.city || '');
    if (weather === null) {
      res.status(400).json({ error: 'City cannot be empty' });
    } else if (typeof weather === 'string') {
      res.status(500).json({ error: weather });
    } else {
      res.json(weather);
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

// Handle 404 with JSON response
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

describe('Weather API Tests', () => {
  describe('GET /api/weather/:city', () => {
    it('should return weather data for a valid city', async () => {
      const response = await request(app)
        .get('/api/weather/Jakarta')
        .expect('Content-Type', /json/)
        .expect(200);

      // Assert response structure
      expect(response.body).toBeDefined();
      expect(response.body.city).toBe('Jakarta');
      expect(typeof response.body.temperature).toBe('number');
      expect(response.body.temperature).toBeGreaterThanOrEqual(5);
      expect(response.body.temperature).toBeLessThanOrEqual(40);
      expect(['Sunny', 'Cloudy', 'Rainy', 'Stormy']).toContain(response.body.conditions);
      expect(typeof response.body.humidity).toBe('number');
      expect(typeof response.body.wind_speed).toBe('number');
      expect(response.body.date_recorded).toBeDefined();
    });

    it('should return 500 for error city', async () => {
      const response = await request(app)
        .get('/api/weather/error')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBe('error city');
    });
  });
});
