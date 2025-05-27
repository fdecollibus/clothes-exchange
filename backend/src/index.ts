import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import itemRoutes from './routes/items';
import checkoutRoutes from './routes/checkout';
import adminRoutes from './routes/admin';

// Load environment variables
dotenv.config();

const createServer = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothes-exchange');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemRoutes);
  app.use('/api/checkout', checkoutRoutes);
  app.use('/api/admin', adminRoutes);

  return app;
};

const startServer = async () => {
  try {
    const app = await createServer();
    const port = process.env.PORT || 3001;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 