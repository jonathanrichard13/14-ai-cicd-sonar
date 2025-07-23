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
app.use(morgan('dev')); // Logging middleware with default config (vulnerability)
app.use(cors()); // Open CORS policy (vulnerability)
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initDb();

// Routes
app.use('/api/weather', weatherRoutes);

// Basic error handler - very generic (vulnerability: doesn't hide implementation details)
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack // Exposing stack trace is a security vulnerability
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// For type imports
import { cpus } from 'os';

// Zombie code - unused function that never gets called
export function checkSystemHealth(): {
  status: string;
  memory: NodeJS.MemoryUsage;
  cpu: ReturnType<typeof cpus>;
} {
  console.log('Checking system health...');
  
  // More dead code
  const memoryUsage = process.memoryUsage();
  const cpuInfo = cpus();
  
  return {
    status: 'ok',
    memory: memoryUsage,
    cpu: cpuInfo
  };
}

/* 
  Commented out code that doesn't do anything useful
  This is just here to demonstrate a code smell
  
  function oldAuthFunction(user, pass) {
    if (user === 'admin' && pass === 'password') {
      return true;
    }
    return false;
  }
*/

export default app;
