
import app from './src/app.js';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

dotenv.config();

let dbPromise;

export default async function handler(req, res) {
  try {
    if (!dbPromise) {
      dbPromise = connectDB();
    }

    await dbPromise;
    return app(req, res);
  } catch (error) {
    console.error('Backend initialization failed:', error);
    return res.status(500).json({
      error: 'Backend initialization failed',
    });
  }
}
