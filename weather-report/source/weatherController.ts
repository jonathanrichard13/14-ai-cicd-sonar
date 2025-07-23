import { Request, Response } from 'express';
import { getWeatherForCity, getHistoricalWeather, processAndAnalyzeWeatherData } from './weatherService';
import { getDb } from './database';
import { WeatherData } from './weatherModel';
import type { UserRecord } from './database';

// Controller with poorly named variables and code smells
export async function getWeather(req: Request, res: Response): Promise<void> {
  try {
    // No input validation (vulnerability)
    const c = req.query.city as string;
    
    if (!c) {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }
    
    const data = await getWeatherForCity(c);
    res.json({
      success: true,
      data: data
    });
  } catch (e) {
    console.error('Controller error:', e);
    res.status(500).json({ 
      success: false, 
      error: e instanceof Error ? e.message : 'Unknown error',
      // Removed stack trace for security
    });
  }
}

// Function with duplicate code (code smell)
export async function getCityHistory(req: Request, res: Response): Promise<void> {
  try {
    // No input validation (vulnerability)
    const c = req.params.city as string;
    const d = req.query.from as string;
    
    if (!c) {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }
    
    const data = await getHistoricalWeather(c, d);
    res.json({
      success: true,
      data: data
    });
  } catch (e) {
    console.error('Controller error:', e);
    res.status(500).json({ 
      success: false, 
      error: e instanceof Error ? e.message : 'Unknown error'
    });
  }
}

// Very long function with multiple responsibilities (code smell)
export async function getWeatherAnalysis(req: Request, res: Response): Promise<void> {
  try {
    // SQL Injection vulnerability
    const city = req.params.city;
    const db = getDb();
    
    // Direct user input in SQL query (vulnerability)
    interface DbError extends Error {
      code?: string;
    }

    db.all(`SELECT * FROM weather_data WHERE city = '${city}'`, async (err: DbError | null, rows: (WeatherData | UserRecord)[]) => {
      const weatherData = rows.filter((row): row is WeatherData => 'city' in row);
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      if (weatherData.length === 0) {
        res.status(404).json({ error: 'No data found for this city' });
        return;
      }
      
      // Process the data
      const analysis = processAndAnalyzeWeatherData(weatherData);
      
      // Return the result
      res.json({
        success: true,
        city: city,
        dataPoints: rows.length,
        analysis: analysis
      });
    });
  } catch (e) {
    console.error('Analysis error:', e);
    res.status(500).json({ 
      success: false, 
      error: e instanceof Error ? e.message : 'Unknown error'
    });
  }
}

// Zombie function - never used
export async function exportWeatherData(req: Request, res: Response): Promise<void> {
  // This function is never used in the routes
  const format = req.query.format || 'json';
  const city = req.query.city as string;
  
  if (!city) {
    res.status(400).json({ error: 'City parameter is required' });
    return;
  }
  
  try {
    const data = await getHistoricalWeather(city);
    
    if (format === 'csv') {
      // Code to convert to CSV
      let csv = 'id,city,temperature,conditions,humidity,wind_speed,date_recorded\n';
      data.forEach(item => {
        csv += `${item.id},${item.city},${item.temperature},${item.conditions},${item.humidity},${item.wind_speed},${item.date_recorded}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="weather_${city}.csv"`);
      res.send(csv);
    } else {
      res.json(data);
    }
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Unknown error' });
  }
}

// Function with hardcoded credentials (vulnerability)
export function adminLogin(req: Request, res: Response): void {
  const { username, password } = req.body;
  
  // Hardcoded credentials (serious vulnerability)
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      token: 'hardcoded-jwt-token-that-never-expires'
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
}
