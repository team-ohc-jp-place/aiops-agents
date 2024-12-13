import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';
import { db } from '../../db';
import { pets } from '../../db/schema';
import { vi } from 'vitest';

const app = express();
app.use(express.json());
registerRoutes(app);

describe('API Routes', () => {
  const mockPet = {
    id: 1,
    name: 'Test Pet',
    species: 'Dog',
    breed: 'Test Breed',
    age: 2,
    price: '100.00',
    description: 'Test description',
    imageUrl: 'test-image.jpg',
    stock: 5,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/pets', () => {
    it('should return all pets', async () => {
      vi.spyOn(db, 'select').mockReturnValueOnce({
        from: () => Promise.resolve([mockPet]),
      } as any);

      const response = await request(app).get('/api/pets');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockPet]);
    });

    it('should handle database errors', async () => {
      vi.spyOn(db, 'select').mockReturnValueOnce({
        from: () => Promise.reject(new Error('Database error')),
      } as any);

      const response = await request(app).get('/api/pets');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch pets');
    });
  });

  describe('GET /api/pets/:id', () => {
    it('should return a single pet', async () => {
      vi.spyOn(db, 'select').mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([mockPet]),
          }),
        }),
      } as any);

      const response = await request(app).get('/api/pets/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPet);
    });

    it('should return 404 for non-existent pet', async () => {
      vi.spyOn(db, 'select').mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
        }),
      } as any);

      const response = await request(app).get('/api/pets/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Pet not found');
    });
  });

  describe('POST /api/pets', () => {
    const newPet = {
      name: 'New Pet',
      species: 'Cat',
      breed: 'Test Breed',
      age: 1,
      price: '50.00',
      description: 'Test description',
      imageUrl: 'test-image.jpg',
      stock: 3,
    };

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/pets')
        .send(newPet);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });
});
