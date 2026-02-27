import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database';

// Import routes
import categoriesRouter from './routes/categories';
import brandsRouter from './routes/brands';
import conditionsRouter from './routes/conditions';
import productsRouter from './routes/products';
import usersRouter from './routes/users';
import orderRouter from './routes/order';
import payphoneRouter from './routes/payphone';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Digital Store API',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      brands: '/api/brands',
      conditions: '/api/conditions',
      products: '/api/products',
      payphone: '/api/payphone'
    }
  });
});

// API Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/conditions', conditionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payphone', payphoneRouter);

// Payphone response endpoint (not under /api)
app.use('/', payphoneRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📊 API endpoints available at http://localhost:${port}/api`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});