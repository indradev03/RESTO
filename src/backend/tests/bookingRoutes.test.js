// __tests__/bookingRoutes.test.js

import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock all booking controller functions
const bookingController = {
  createBooking: jest.fn((req, res) => res.status(201).json({ message: 'createBooking ok' })),
  getAllBookings: jest.fn((req, res) => res.status(200).json({ message: 'getAllBookings ok' })),
  getBookingById: jest.fn((req, res) => res.status(200).json({ message: 'getBookingById ok' })),
  getBookingsByUserId: jest.fn((req, res) => res.status(200).json({ message: 'getBookingsByUserId ok' })),
  deleteBookingById: jest.fn((req, res) => res.status(200).json({ message: 'deleteBookingById ok' })),
};

// Build test router with mocked controllers
function createTestRouter() {
  const router = express.Router();

  router.post('/', bookingController.createBooking);
  router.get('/', bookingController.getAllBookings);
  router.get('/:id', bookingController.getBookingById);
  router.get('/user/:userId', bookingController.getBookingsByUserId);
  router.delete('/:id', bookingController.deleteBookingById);

  return router;
}

describe('Booking Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/bookings', createTestRouter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/bookings calls createBooking controller', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ table_id: 1, user_id: 2, date: '2025-07-25', time: '19:00' });

    expect(res.statusCode).toBe(201);
    expect(bookingController.createBooking).toHaveBeenCalled();
  });

  test('GET /api/bookings calls getAllBookings controller', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.statusCode).toBe(200);
    expect(bookingController.getAllBookings).toHaveBeenCalled();
  });

  test('GET /api/bookings/:id calls getBookingById controller', async () => {
    const res = await request(app).get('/api/bookings/123');
    expect(res.statusCode).toBe(200);
    expect(bookingController.getBookingById).toHaveBeenCalled();
  });

  test('GET /api/bookings/user/:userId calls getBookingsByUserId controller', async () => {
    const res = await request(app).get('/api/bookings/user/456');
    expect(res.statusCode).toBe(200);
    expect(bookingController.getBookingsByUserId).toHaveBeenCalled();
  });

  test('DELETE /api/bookings/:id calls deleteBookingById controller', async () => {
    const res = await request(app).delete('/api/bookings/789');
    expect(res.statusCode).toBe(200);
    expect(bookingController.deleteBookingById).toHaveBeenCalled();
  });
});
