import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabaseIfEmpty } from '../data/seedDatabase.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pharma-erp';
let mongoConnected = false;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await seedDatabaseIfEmpty();
    mongoConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    mongoConnected = false;
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn('Falling back to backend/db.json data.');
  }
}

function isMongoConnected() {
  return mongoConnected && mongoose.connection.readyState === 1;
}

export default connectDB;
export { isMongoConnected };
