import request from 'supertest';
import { app } from '../../src/app';
import { User } from '../../src/models/User';
import Item from '../../src/models/Item';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Admin Endpoints', () => {
  let adminToken: string;
  let sellerToken: string;
  let testSeller: any;
  let testItem: any;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Item.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true
    });

    // Create seller user
    testSeller = await User.create({
      name: 'Test Seller',
      email: 'seller@example.com',
      password: 'password123',
      sellerNumber: '123'
    });

    // Create test item
    testItem = await Item.create({
      userId: testSeller._id,
      itemNumber: 1,
      description: 'Test Item',
      price: 10.99,
      size: 'M',
      condition: 'new',
      category: 'clothing',
      status: 'available'
    });

    // Generate tokens
    adminToken = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    sellerToken = jwt.sign(
      { id: testSeller._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/admin/sellers', () => {
    it('should get all sellers when admin', async () => {
      const res = await request(app)
        .get('/api/admin/sellers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('name', 'Test Seller');
    });

    it('should not get sellers when not admin', async () => {
      const res = await request(app)
        .get('/api/admin/sellers')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/sellers/:sellerId/items', () => {
    it('should get seller items when admin', async () => {
      const res = await request(app)
        .get(`/api/admin/sellers/${testSeller._id}/items`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('description', 'Test Item');
    });

    it('should not get seller items when not admin', async () => {
      const res = await request(app)
        .get(`/api/admin/sellers/${testSeller._id}/items`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/admin/items/:id', () => {
    it('should delete item when admin', async () => {
      const res = await request(app)
        .delete(`/api/admin/items/${testItem._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      
      const deletedItem = await Item.findById(testItem._id);
      expect(deletedItem).toBeNull();
    });

    it('should not delete item when not admin', async () => {
      const res = await request(app)
        .delete(`/api/admin/items/${testItem._id}`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(403);
      
      const item = await Item.findById(testItem._id);
      expect(item).not.toBeNull();
    });
  });

  describe('PATCH /api/admin/items/:id', () => {
    it('should update item when admin', async () => {
      const res = await request(app)
        .patch(`/api/admin/items/${testItem._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'sold',
          adminComment: 'Test comment'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'sold');
      expect(res.body).toHaveProperty('adminComment', 'Test comment');
    });

    it('should not update item when not admin', async () => {
      const res = await request(app)
        .patch(`/api/admin/items/${testItem._id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          status: 'sold'
        });

      expect(res.status).toBe(403);
    });
  });
}); 