// __tests__/tableController.test.js

import { jest } from '@jest/globals';
import * as tableController from '../controllers/tableController.js'; // adjust path if needed
import pool from '../database/db.js';

// Mock pool.query before tests
jest.mock('../database/db.js', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Table Controller', () => {
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
    pool.query = jest.fn(); // fresh mock fn per test
  });

  describe('addTable', () => {
    it('should add a table successfully', async () => {
      req.body = {
        name: 'Table 1',
        seats: '4',
        location: 'Near window',
        description: 'Nice table',
        status: 'Available',
      };
      req.file = { filename: 'table1.jpg' };

      pool.query
        .mockResolvedValueOnce({
          rows: [{
            table_id: 1,
            name: 'Table 1',
            seats: 4,
            location: 'Near window',
            description: 'Nice table',
            image_url: '/uploads/table1.jpg',
            status: 'Available',
          }],
        })
        .mockResolvedValueOnce({}); // for recent_activities insert

      await tableController.addTable(req, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('INSERT INTO restaurant_tables'),
        ['Table 1', 4, 'Near window', 'Nice table', '/uploads/table1.jpg', 'Available']
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO recent_activities (type, message) VALUES ($1, $2)',
        ['table', 'New table added: Table 1']
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          table_id: 1,
          name: 'Table 1',
          seats: 4,
          image_url: '/uploads/table1.jpg',
          status: 'Available',
        })
      );
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await tableController.addTable(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('getTables', () => {
    it('should get all tables successfully', async () => {
      const tables = [
        { table_id: 1, name: 'Table 1', seats: 4, image_url: null, status: 'Available' },
        { table_id: 2, name: 'Table 2', seats: 2, image_url: '/uploads/table2.jpg', status: 'For Booking' },
      ];

      pool.query.mockResolvedValueOnce({ rows: tables });

      await tableController.getTables(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM restaurant_tables ORDER BY table_id DESC');
      expect(res.json).toHaveBeenCalledWith(tables);
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await tableController.getTables(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('getTableById', () => {
    it('should get table by id successfully', async () => {
      req.params = { table_id: '1' };
      const table = {
        table_id: 1,
        name: 'Table 1',
        seats: 4,
        location: 'Near window',
        description: 'Nice table',
        image_url: '/uploads/table1.jpg',
        status: 'Available',
      };

      pool.query.mockResolvedValueOnce({ rows: [table] });

      await tableController.getTableById(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM restaurant_tables WHERE table_id = $1', ['1']);
      expect(res.json).toHaveBeenCalledWith(table);
    });

    it('should return 404 if table not found', async () => {
      req.params = { table_id: '999' };
      pool.query.mockResolvedValueOnce({ rows: [] });

      await tableController.getTableById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Table not found' });
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await tableController.getTableById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('updateTable', () => {
    it('should update a table successfully with new image', async () => {
      req.params = { table_id: '1' };
      req.body = {
        name: 'Updated Table',
        seats: '6',
        location: 'Center hall',
        description: 'Updated description',
        status: 'Reserved',
      };
      req.file = { filename: 'newtable.jpg' };

      pool.query
        .mockResolvedValueOnce({
          rows: [{ table_id: 1, image_url: '/uploads/oldtable.jpg', status: 'Available' }],
        }) // existing table
        .mockResolvedValueOnce({
          rows: [{
            table_id: 1,
            name: 'Updated Table',
            seats: 6,
            location: 'Center hall',
            description: 'Updated description',
            image_url: '/uploads/newtable.jpg',
            status: 'Reserved',
          }],
        }) // update result
        .mockResolvedValueOnce({}); // recent_activities insert

      await tableController.updateTable(req, res);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          table_id: 1,
          name: 'Updated Table',
          seats: 6,
          image_url: '/uploads/newtable.jpg',
          status: 'Reserved',
        })
      );
    });

    it('should update a table successfully without new image (keep old image)', async () => {
      req.params = { table_id: '1' };
      req.body = {
        name: 'Updated Table',
        seats: '5',
        location: 'Corner',
        description: 'No new image',
        status: 'Available',
      };
      req.file = undefined;

      pool.query
        .mockResolvedValueOnce({
          rows: [{ table_id: 1, image_url: '/uploads/oldtable.jpg', status: 'For Booking' }],
        })
        .mockResolvedValueOnce({
          rows: [{
            table_id: 1,
            name: 'Updated Table',
            seats: 5,
            location: 'Corner',
            description: 'No new image',
            image_url: '/uploads/oldtable.jpg',
            status: 'Available',
          }],
        })
        .mockResolvedValueOnce({});

      await tableController.updateTable(req, res);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          image_url: '/uploads/oldtable.jpg',
          seats: 5,
          status: 'Available',
        })
      );
    });

    it('should return 404 if table not found', async () => {
      req.params = { table_id: '999' };
      pool.query.mockResolvedValueOnce({ rows: [] });

      await tableController.updateTable(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Table not found' });
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await tableController.updateTable(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('deleteTable', () => {
    it('should delete table successfully', async () => {
      req.params = { table_id: '1' };

      pool.query
        .mockResolvedValueOnce({
          rows: [{ table_id: 1, name: 'Table to Delete' }],
        }) // existing table fetch
        .mockResolvedValueOnce({}) // delete query
        .mockResolvedValueOnce({}); // recent_activities insert

      await tableController.deleteTable(req, res);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM restaurant_tables WHERE table_id = $1', ['1']);
      expect(pool.query).toHaveBeenNthCalledWith(2, 'DELETE FROM restaurant_tables WHERE table_id = $1', ['1']);
      expect(pool.query).toHaveBeenNthCalledWith(
        3,
        'INSERT INTO recent_activities (type, message) VALUES ($1, $2)',
        ['table', 'Table deleted: Table to Delete']
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'Table deleted successfully' });
    });

    it('should return 404 if table not found', async () => {
      req.params = { table_id: '999' };
      pool.query.mockResolvedValueOnce({ rows: [] });

      await tableController.deleteTable(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Table not found' });
    });

    it('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await tableController.deleteTable(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });
});
