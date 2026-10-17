
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabaseIfEmpty } from '../data/seedDatabase.js';

dotenv.config();

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing');
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 10000,
        });

        await seedDatabaseIfEmpty();

        console.log('MongoDB connected successfully');
        return mongoose.connection;
      } catch (error) {
        connectionPromise = null;
        console.error('MongoDB connection failed:', error.message);
        throw error;
      }
    })();
  }

  return connectionPromise;
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDB;
export { isMongoConnected };
