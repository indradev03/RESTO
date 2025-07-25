// __tests__/tableRoutes.test.js

import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock all controller functions
const tableController = {
  addTable: jest.fn((req, res) => res.status(201).json({ message: 'addTable ok' })),
  getTables: jest.fn((req, res) => res.status(200).json({ message: 'getTables ok' })),
  getTableById: jest.fn((req, res) => res.status(200).json({ message: 'getTableById ok' })),
  updateTable: jest.fn((req, res) => res.status(200).json({ message: 'updateTable ok' })),
  deleteTable: jest.fn((req, res) => res.status(200).json({ message: 'deleteTable ok' })),
};

// Mock multer upload middleware to call next()
const mockUploadMiddleware = (req, res, next) => next();

// Build a test router with mocked controllers and upload middleware
function createTestRouter() {
  const router = express.Router();

  router.post('/', mockUploadMiddleware, tableController.addTable);
  router.get('/', tableController.getTables);
  router.get('/:table_id', tableController.getTableById);
  router.put('/:table_id', mockUploadMiddleware, tableController.updateTable);
  router.delete('/:table_id', tableController.deleteTable);

  return router;
}

describe('Table Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/tables', createTestRouter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/tables calls addTable controller', async () => {
    const res = await request(app)
      .post('/api/tables')
      .field('name', 'Table 1')
      .attach('image', Buffer.from('fake image content'), 'table.jpg');

    expect(res.statusCode).toBe(201);
    expect(tableController.addTable).toHaveBeenCalled();
  });

  test('GET /api/tables calls getTables controller', async () => {
    const res = await request(app).get('/api/tables');
    expect(res.statusCode).toBe(200);
    expect(tableController.getTables).toHaveBeenCalled();
  });

  test('GET /api/tables/:table_id calls getTableById controller', async () => {
    const res = await request(app).get('/api/tables/123');
    expect(res.statusCode).toBe(200);
    expect(tableController.getTableById).toHaveBeenCalled();
  });

  test('PUT /api/tables/:table_id calls updateTable controller', async () => {
    const res = await request(app)
      .put('/api/tables/123')
      .field('name', 'Updated Table')
      .attach('image', Buffer.from('fake image content'), 'newtable.jpg');

    expect(res.statusCode).toBe(200);
    expect(tableController.updateTable).toHaveBeenCalled();
  });

  test('DELETE /api/tables/:table_id calls deleteTable controller', async () => {
    const res = await request(app).delete('/api/tables/123');
    expect(res.statusCode).toBe(200);
    expect(tableController.deleteTable).toHaveBeenCalled();
  });
});
