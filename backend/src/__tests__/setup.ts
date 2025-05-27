import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Helper function to create a test user and get auth token
export const createTestUser = async () => {
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  await user.save();

  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  return { user, token };
}; 