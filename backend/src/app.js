import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use((req, res, next) => {
  if (typeof req.url === 'string') {
    req.url = req.url.replace(/(?:%0A|%0D|\n|\r)/g, '');
  }
  next();
});
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Pharma backend is running' });
});

app.use(errorHandler);

export default app;
