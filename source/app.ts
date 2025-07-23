import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { weatherRoutes } from './weatherRoutes';
import { initDb } from './database';

// Load env vars (but we'll still hardcode some secrets as a vulnerability)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('combined')); // More secure logging format
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
})); // Restricted CORS policy
app.use(bodyParser.json({ limit: '10mb' })); // Add size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database
initDb();

// Routes
app.use('/api/weather', weatherRoutes);

// Secure error handler - doesn't expose implementation details
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log error securely (not exposing stack trace to client)
  console.error('Application error:', err.message);
  
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
