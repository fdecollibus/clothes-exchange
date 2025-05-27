import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth';
import itemRoutes from './routes/items';
import sellerRoutes from './routes/sellers';
import adminRouter from './routes/admin';

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173', 'http://192.168.1.221:5174', 'http://192.168.1.221:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition']
  }));
  app.use(express.json());
  app.use(morgan('dev'));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemRoutes);
  app.use('/api/sellers', sellerRoutes);
  app.use('/api/admin', adminRouter);

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
  });

  return app;
} 