import request from 'supertest';
import express from 'express';
import { getWeatherForCity } from '../source/weatherService';

// Create Express app
const app = express();

// Add route handler
app.get('/api/weather/:city', async (req, res) => {
  try {
    const weather = await getWeatherForCity(req.params.city);
    res.json(weather);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

jest.mock('../source/weatherService');

describe('Weather API Routes', () => {
  describe('GET /api/weather/:city', () => {
    it('should return weather data for a valid city', async () => {
      // Arrange
      const mockWeatherData = {
        city: 'Jakarta',
        temperature: 30,
        conditions: 'Sunny',
        humidity: 70,
        wind_speed: 15,
        date_recorded: new Date().toISOString()
      };

      (getWeatherForCity as jest.Mock).mockResolvedValue(mockWeatherData);

      // Act
      const response = await request(app)
        .get('/api/weather/Jakarta')
        .expect('Content-Type', /json/)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockWeatherData);
      expect(getWeatherForCity).toHaveBeenCalledWith('Jakarta');
    });

    it('should return 400 for invalid city name', async () => {
      // Arrange
      (getWeatherForCity as jest.Mock).mockRejectedValue(new Error('Invalid city'));

      // Act & Assert
      await request(app)
        .get('/api/weather/invalid-city')
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});
