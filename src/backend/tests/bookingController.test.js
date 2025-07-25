// __tests__/bookingController.test.js

import { jest } from '@jest/globals';
import * as bookingController from '../controllers/bookingController.js';
import pool from '../database/db.js';

jest.mock('../database/db.js', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Booking Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    pool.query = jest.fn();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      req.body = {
        table_id: 1,
        user_id: 2,
        name: 'John Doe',
        phone: '1234567890',
        date: '2025-07-25',
        time: '19:00',
      };

      pool.query
        .mockResolvedValueOnce({ rows: [{ booking_id: 1, ...req.body }] }) // insert booking
        .mockResolvedValueOnce({}); // insert recent activity

      await bookingController.createBooking(req, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('INSERT INTO bookings'),
        [1, 2, 'John Doe', '1234567890', '2025-07-25', '19:00']
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO recent_activities (type, message) VALUES ($1, $2)',
        ['booking', expect.stringContaining('Table 1 booked')]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          booking: expect.objectContaining({ booking_id: 1 }),
        })
      );
    });

    it('should return 400 if missing required fields', async () => {
      req.body = { table_id: 1 }; // incomplete

      await bookingController.createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should handle DB errors', async () => {
      req.body = {
        table_id: 1,
        user_id: 2,
        name: 'John Doe',
        phone: '1234567890',
        date: '2025-07-25',
        time: '19:00',
      };
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await bookingController.createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getAllBookings', () => {
    it('should get all bookings', async () => {
      const bookings = [{ booking_id: 1 }, { booking_id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: bookings });

      await bookingController.getAllBookings(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM bookings ORDER BY booking_id DESC;');
      expect(res.json).toHaveBeenCalledWith({ bookings });
    });

    it('should handle DB errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await bookingController.getAllBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getBookingById', () => {
    it('should get booking by ID', async () => {
      req.params.id = '1';
      pool.query.mockResolvedValueOnce({ rows: [{ booking_id: 1 }] });

      await bookingController.getBookingById(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM bookings WHERE booking_id = $1;', ['1']);
      expect(res.json).toHaveBeenCalledWith({ booking: { booking_id: 1 } });
    });

    it('should return 404 if booking not found', async () => {
      req.params.id = '999';
      pool.query.mockResolvedValueOnce({ rows: [] });

      await bookingController.getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
    });

    it('should handle DB errors', async () => {
      req.params.id = '1';
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await bookingController.getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getBookingsByUserId', () => {
    it('should get bookings by user ID', async () => {
      req.params.userId = '2';
      const userBookings = [{ booking_id: 1, user_id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: userBookings });

      await bookingController.getBookingsByUserId(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM bookings WHERE user_id = $1 ORDER BY date DESC, time ASC;',
        ['2']
      );
      expect(res.json).toHaveBeenCalledWith({ bookings: userBookings });
    });

    it('should handle DB errors', async () => {
      req.params.userId = '2';
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await bookingController.getBookingsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('deleteBookingById', () => {
    it('should delete booking successfully', async () => {
      req.params.id = '1';
      pool.query.mockResolvedValueOnce({ rows: [{ booking_id: 1 }] });

      await bookingController.deleteBookingById(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM bookings WHERE booking_id = $1 RETURNING *;',
        ['1']
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking deleted successfully',
        booking: { booking_id: 1 },
      });
    });

    it('should return 404 if booking not found', async () => {
      req.params.id = '999';
      pool.query.mockResolvedValueOnce({ rows: [] });

      await bookingController.deleteBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found or already deleted' });
    });

    it('should handle DB errors', async () => {
      req.params.id = '1';
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await bookingController.deleteBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getTodayBookingCount', () => {
    it('should get today booking count', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ count: '5' }] });

      await bookingController.getTodayBookingCount(req, res);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT COUNT(*)'));
      expect(res.json).toHaveBeenCalledWith({ bookingsToday: 5 });
    });

    it('should handle DB errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB Error'));

      await bookingController.getTodayBookingCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
