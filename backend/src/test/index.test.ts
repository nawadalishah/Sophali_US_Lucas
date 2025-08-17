import app from "../server";
import request from 'supertest';
import mongoose from 'mongoose';

// Set test environment to suppress logs
process.env.NODE_ENV = 'test';

const mongoUri = "mongodb://localhost:27017/your-database";

beforeAll(async () => {
  // Connect to MongoDB before running tests
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    // Optionally, you can log connection success
    // console.log("Connected to MongoDB for tests");
  } catch (err) {
    // Only log critical errors during tests
    if (process.env.NODE_ENV !== 'test') {
      console.error("Failed to connect to MongoDB before tests:", err);
    }
    throw err;
  }
});

afterAll(async () => {
  // Delete all data after tests
  try {
    if (mongoose.connection && mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
      // Optionally, you can log deletion success
      // console.log("All collections cleared after tests");
    }
  } catch (err) {
    // Only log critical errors during tests
    if (process.env.NODE_ENV !== 'test') {
      console.error("Failed to clear collections after tests:", err);
    }
    throw err;
  }
  // Disconnect from MongoDB after all tests
  await mongoose.disconnect();
});

import "./user"