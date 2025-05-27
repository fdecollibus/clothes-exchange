import mongoose from 'mongoose';
import { User } from '../models/User';
import Item from '../models/Item';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothes-exchange');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      isAdmin: true
    });
    console.log('Created admin user');

    // Create test seller
    const sellerPassword = await bcrypt.hash('password123', 10);
    const seller = await User.create({
      name: 'Test Seller',
      email: 'seller@example.com',
      password: sellerPassword,
      sellerNumber: '123'
    });
    console.log('Created test seller');

    // Create test items
    const items = await Item.create([
      {
        userId: seller._id,
        itemNumber: 1,
        description: 'Blue Jeans',
        price: 5.99,
        size: 'M',
        condition: 'new',
        category: 'clothing',
        status: 'available'
      },
      {
        userId: seller._id,
        itemNumber: 2,
        description: 'Red T-Shirt',
        price: 3.99,
        size: 'S',
        condition: 'like new',
        category: 'clothing',
        status: 'available'
      },
      {
        userId: seller._id,
        itemNumber: 3,
        description: 'Winter Jacket',
        price: 12.99,
        size: 'L',
        condition: 'good',
        category: 'clothing',
        status: 'available'
      }
    ]);
    console.log('Created test items');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

setupDatabase(); 