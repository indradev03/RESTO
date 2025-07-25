// __tests__/productController.test.js

import { jest } from '@jest/globals';
import * as productController from '../controllers/productController.js'; // Adjust the path!
import pool from '../database/db.js';

// Mock pool.query before tests
jest.mock('../database/db.js', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Product Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: undefined,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Re-assign pool.query to a fresh mock function for each test
    pool.query = jest.fn();
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      req.body = { name: 'Test Product', description: 'Test Desc', price: '100' };
      req.file = { filename: 'image.jpg' };

      pool.query
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: 'Test Product', description: 'Test Desc', price: 100, image_url: '/uploads/image.jpg' }],
        })
        .mockResolvedValueOnce({});

      await productController.addProduct(req, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('INSERT INTO resto_products'),
        ['Test Product', 'Test Desc', 100, '/uploads/image.jpg']
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO recent_activities (type, message) VALUES ($1, $2)',
        ['product', 'New product added: Test Product']
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'Test Product',
          description: 'Test Desc',
          price: 100,
          image_url: '/uploads/image.jpg',
        })
      );
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await productController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('getProducts', () => {
    it('should get all products successfully', async () => {
      const products = [
        { id: 1, name: 'Prod1', description: 'Desc1', price: 10, image_url: null },
        { id: 2, name: 'Prod2', description: 'Desc2', price: 20, image_url: '/uploads/img2.jpg' },
      ];

      pool.query.mockResolvedValueOnce({ rows: products });

      await productController.getProducts(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM resto_products ORDER BY id DESC');
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await productController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully with new image', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Updated', description: 'Updated Desc', price: '200' };
      req.file = { filename: 'newimage.jpg' };

      pool.query
        .mockResolvedValueOnce({ rows: [{ id: 1, image_url: '/uploads/oldimage.jpg' }] }) // existing
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: 'Updated', description: 'Updated Desc', price: 200, image_url: '/uploads/newimage.jpg' }],
        }) // update
        .mockResolvedValueOnce({}); // recent activity

      await productController.updateProduct(req, res);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'Updated',
          description: 'Updated Desc',
          price: 200,
          image_url: '/uploads/newimage.jpg',
        })
      );
    });

    it('should update a product successfully without new image (keep old image)', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Updated', description: 'Updated Desc', price: '150' };
      req.file = undefined;

      pool.query
        .mockResolvedValueOnce({ rows: [{ id: 1, image_url: '/uploads/oldimage.jpg' }] })
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: 'Updated', description: 'Updated Desc', price: 150, image_url: '/uploads/oldimage.jpg' }],
        })
        .mockResolvedValueOnce({});

      await productController.updateProduct(req, res);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          image_url: '/uploads/oldimage.jpg',
          price: 150,
        })
      );
    });

    it('should return 404 if product not found', async () => {
      req.params = { id: '999' };
      pool.query.mockResolvedValueOnce({ rows: [] });

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should return 400 if price invalid', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Updated', description: 'Desc', price: 'abc' };
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, image_url: null }] });

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid price' });
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      req.params = { id: '1' };

      pool.query
        .mockResolvedValueOnce({ rowCount: 1 }) // delete
        .mockResolvedValueOnce({}); // recent activity

      await productController.deleteProduct(req, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1, 'DELETE FROM resto_products WHERE id = $1', ['1']);
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO recent_activities (type, message) VALUES ($1, $2)',
        ['product', 'Product deleted (ID: 1)']
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
    });

    it('should return 404 if product not found', async () => {
      req.params = { id: '999' };
      pool.query.mockResolvedValueOnce({ rowCount: 0 });

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });
});
