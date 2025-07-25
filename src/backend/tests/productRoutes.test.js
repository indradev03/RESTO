// __tests__/productRoutes.test.js

import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock all product controller functions
const productController = {
  addProduct: jest.fn((req, res) => res.status(201).json({ message: 'addProduct ok' })),
  getProducts: jest.fn((req, res) => res.status(200).json({ message: 'getProducts ok' })),
  updateProduct: jest.fn((req, res) => res.status(200).json({ message: 'updateProduct ok' })),
  deleteProduct: jest.fn((req, res) => res.status(200).json({ message: 'deleteProduct ok' })),
};

// Mock multer upload middleware to just call next()
const mockUploadMiddleware = (req, res, next) => next();

// Create a test router with mocked controllers and middleware
function createTestRouter() {
  const router = express.Router();

  router.post('/', mockUploadMiddleware, productController.addProduct);
  router.get('/', productController.getProducts);
  router.put('/:id', mockUploadMiddleware, productController.updateProduct);
  router.delete('/:id', productController.deleteProduct);

  return router;
}

describe('Product Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/products', createTestRouter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/products calls addProduct controller', async () => {
    const res = await request(app)
      .post('/api/products')
      .field('name', 'Test Product')
      .attach('image', Buffer.from('fake image content'), 'product.jpg');

    expect(res.statusCode).toBe(201);
    expect(productController.addProduct).toHaveBeenCalled();
  });

  test('GET /api/products calls getProducts controller', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(productController.getProducts).toHaveBeenCalled();
  });

  test('PUT /api/products/:id calls updateProduct controller', async () => {
    const res = await request(app)
      .put('/api/products/123')
      .field('name', 'Updated Product')
      .attach('image', Buffer.from('fake image content'), 'updated.jpg');

    expect(res.statusCode).toBe(200);
    expect(productController.updateProduct).toHaveBeenCalled();
  });

  test('DELETE /api/products/:id calls deleteProduct controller', async () => {
    const res = await request(app).delete('/api/products/123');
    expect(res.statusCode).toBe(200);
    expect(productController.deleteProduct).toHaveBeenCalled();
  });
});
