const mongoose = require('mongoose');
require('dotenv').config();

let db;

const connectDB = async () => {
  try {
    const client = await mongoose.connect(process.env.MONGO_URL);
    db = client.connection.db; // Get the database instance
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = { connectDB, getDB };
