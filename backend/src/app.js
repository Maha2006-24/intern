
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// General middleware
app.use(cors());
app.use(express.json());

// Remove newline characters from request URLs
app.use((req, res, next) => {
  if (typeof req.url === 'string') {
    req.url = req.url.replace(/(?:%0A|%0D|\n|\r)/g, '');
  }
  next();
});

// Health check (does not require a database connection)
app.get('/', (req, res) => {
  res.json({
    status: 'Pharma backend is running',
  });
});

// Ensure MongoDB is available before accessing API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database unavailable:', error.message);

    res.status(503).json({
      error: 'Database unavailable. Please try again later.',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Error handler (must remain last)
app.use(errorHandler);

export default app;
