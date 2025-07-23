import { Request, Response } from 'express';
import { 
  getWeather, 
  getCityHistory, 
  getWeatherAnalysis,
  exportWeatherData,
  adminLogin 
} from '../source/weatherController';
import * as weatherService from '../source/weatherService';
import * as database from '../source/database';

// Mock the dependencies
jest.mock('../source/weatherService');
jest.mock('../source/database');

const mockedWeatherService = weatherService as jest.Mocked<typeof weatherService>;
const mockedDatabase = database as jest.Mocked<typeof database>;

describe('Weather Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {};
    mockResponse = {
      json: jsonMock,
      status: statusMock
    };

    jest.clearAllMocks();
  });

  describe('getWeather', () => {
    it('should return weather data for valid city', async () => {
      // Arrange
      mockRequest.query = { city: 'Jakarta' };
      const mockWeatherData = {
        city: 'Jakarta',
        temperature: 25,
        conditions: 'Sunny',
        humidity: 60,
        wind_speed: 10,
        date_recorded: '2023-01-01'
      };
      mockedWeatherService.getWeatherForCity.mockResolvedValue(mockWeatherData);

      // Act
      await getWeather(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockedWeatherService.getWeatherForCity).toHaveBeenCalledWith('Jakarta');
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockWeatherData
      });
    });

    it('should return 400 for missing city parameter', async () => {
      // Arrange
      mockRequest.query = {};

      // Act
      await getWeather(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'City parameter is required'
      });
    });

    it('should return 500 for service errors', async () => {
      // Arrange
      mockRequest.query = { city: 'Jakarta' };
      mockedWeatherService.getWeatherForCity.mockRejectedValue(new Error('Service error'));

      // Act
      await getWeather(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Service error'
      });
    });

    it('should handle unknown errors', async () => {
      // Arrange
      mockRequest.query = { city: 'Jakarta' };
      mockedWeatherService.getWeatherForCity.mockRejectedValue('Unknown error');

      // Act
      await getWeather(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown error'
      });
    });
  });

  describe('getCityHistory', () => {
    it('should return historical weather data', async () => {
      // Arrange
      mockRequest.query = { city: 'Jakarta', from: '2023-01-01' };
      const mockHistoricalData = [{
        city: 'Jakarta',
        temperature: 25,
        conditions: 'Sunny',
        humidity: 60,
        wind_speed: 10,
        date_recorded: '2023-01-01'
      }];
      mockedWeatherService.getHistoricalWeather.mockResolvedValue(mockHistoricalData);

      // Act
      await getCityHistory(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockedWeatherService.getHistoricalWeather).toHaveBeenCalledWith('Jakarta', '2023-01-01');
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockHistoricalData
      });
    });

    it('should return 400 for missing city parameter', async () => {
      // Arrange
      mockRequest.query = {};

      // Act
      await getCityHistory(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'City parameter is required'
      });
    });
  });

  describe('getWeatherAnalysis', () => {
    it('should analyze weather data from request body', async () => {
      // Arrange
      mockRequest.body = {
        data: [{
          city: 'Jakarta',
          temperature: 25,
          conditions: 'Sunny',
          humidity: 60,
          wind_speed: 10,
          date_recorded: '2023-01-01'
        }]
      };
      const mockAnalysis = { averageTemp: 25, mostCommonCondition: 'Sunny' };
      mockedWeatherService.processAndAnalyzeWeatherData.mockReturnValue(mockAnalysis);

      // Act
      await getWeatherAnalysis(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockedWeatherService.processAndAnalyzeWeatherData).toHaveBeenCalledWith(mockRequest.body.data);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        analysis: mockAnalysis
      });
    });

    it('should return 400 for missing data', async () => {
      // Arrange
      mockRequest.body = {};

      // Act
      await getWeatherAnalysis(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Weather data array is required'
      });
    });
  });

  describe('adminLogin', () => {
    it('should handle admin login', () => {
      // Arrange
      mockRequest.body = { username: 'admin', password: 'password' };

      // Act
      adminLogin(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });
  });
});
