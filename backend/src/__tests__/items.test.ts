import request from 'supertest';
import { Express } from 'express';
import { createTestUser } from './setup';
import { createServer } from '../app';
import Item from '../models/Item';

let app: Express;

beforeAll(async () => {
  app = await createServer();
});

describe('Items API', () => {
  describe('POST /api/items', () => {
    it('should create a new item with auto-generated item number', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Item',
          description: 'Test Description',
          size: 'M',
          condition: 'neu',
          category: 'kleidung',
          price: 10.99
        });

      expect(response.status).toBe(201);
      expect(response.body.itemNumber).toBe(1);
      expect(response.body.title).toBe('Test Item');
    });

    it('should auto-increment item numbers', async () => {
      const { token, user } = await createTestUser();

      // Create first item
      const response1 = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'First Item',
          description: 'First Description',
          size: 'S',
          condition: 'neu',
          category: 'kleidung',
          price: 5.99
        });

      // Create second item
      const response2 = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Second Item',
          description: 'Second Description',
          size: 'L',
          condition: 'sehr_gut',
          category: 'schuhe',
          price: 15.99
        });

      expect(response1.body.itemNumber).toBe(1);
      expect(response2.body.itemNumber).toBe(2);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({
          title: 'Test Item',
          description: 'Test Description',
          size: 'M',
          condition: 'neu',
          category: 'kleidung',
          price: 10.99
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/items/my-items', () => {
    it('should return user\'s items', async () => {
      const { token, user } = await createTestUser();

      // Create test items
      await Item.create([
        {
          title: 'Item 1',
          description: 'Description 1',
          size: 'S',
          condition: 'neu',
          category: 'kleidung',
          price: 10.99,
          userId: user._id,
          itemNumber: 1
        },
        {
          title: 'Item 2',
          description: 'Description 2',
          size: 'M',
          condition: 'gut',
          category: 'schuhe',
          price: 20.99,
          userId: user._id,
          itemNumber: 2
        }
      ]);

      const response = await request(app)
        .get('/api/items/my-items')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Item 1');
      expect(response.body[1].title).toBe('Item 2');
    });
  });

  describe('PATCH /api/items/:id', () => {
    it('should update an item', async () => {
      const { token, user } = await createTestUser();

      // Create test item
      const item = await Item.create({
        title: 'Original Title',
        description: 'Original Description',
        size: 'S',
        condition: 'neu',
        category: 'kleidung',
        price: 10.99,
        userId: user._id,
        itemNumber: 1
      });

      const response = await request(app)
        .patch(`/api/items/${item._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          price: 15.99
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.price).toBe(15.99);
      expect(response.body.itemNumber).toBe(1); // Item number should remain unchanged
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an item', async () => {
      const { token, user } = await createTestUser();

      // Create test item
      const item = await Item.create({
        title: 'Item to Delete',
        description: 'Description',
        size: 'S',
        condition: 'neu',
        category: 'kleidung',
        price: 10.99,
        userId: user._id,
        itemNumber: 1
      });

      const response = await request(app)
        .delete(`/api/items/${item._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      // Verify item is deleted
      const deletedItem = await Item.findById(item._id);
      expect(deletedItem).toBeNull();
    });
  });
}); 