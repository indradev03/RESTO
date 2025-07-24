
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import * as adminController from '../controllers/adminController.js';
import pool from '../database/db.js';

// Mocks
jest.mock('../database/db.js', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_token'),
}));

// Setup Express app for tests
const app = express();
app.use(express.json());
app.post('/admin/login', adminController.adminLogin);
app.get('/admin/email/:email', adminController.getAdminByEmail);
app.get('/admin/all', adminController.getAllAdmins);
app.get('/admin/stats', adminController.getAdminDashboardStats);
app.get('/admin/activities', adminController.getRecentActivities);
app.delete('/admin/activities/:id', adminController.deleteRecentActivity);

describe('🔐 Admin Controller Tests (no mockResolvedValueOnce)', () => {

  // ✅ Login
  test('✅ login success with gmail', async () => {
    pool.query = jest.fn(async () => ({
      rows: [{
        id: 1,
        username: 'admin1',
        email: 'admin1@gmail.com',
        password: '123456saroj@'
      }]
    }));

    const res = await request(app)
      .post('/api/admin/login')
      .send({ emailOrUsername: 'admin1@gmail.com', password: '123456saroj@' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('mocked_token');
  });

  test('❌ reject non-gmail login', async () => {
    pool.query = jest.fn(async () => ({
      rows: [{
        id: 2,
        username: 'admin2',
        email: 'admin2@yahoo.com',
        password: '123456'
      }]
    }));

    const res = await request(app)
      .post('/admin/login')
      .send({ emailOrUsername: 'admin2@yahoo.com', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Only gmail.com/);
  });

  test('❌ invalid password', async () => {
    pool.query = jest.fn(async () => ({
      rows: [{
        id: 3,
        username: 'admin3',
        email: 'admin3@gmail.com',
        password: 'correctpass'
      }]
    }));

    const res = await request(app)
      .post('/admin/login')
      .send({ emailOrUsername: 'admin3@gmail.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Invalid password/);
  });

  test('❌ user not found', async () => {
    pool.query = jest.fn(async () => ({ rows: [] }));

    const res = await request(app)
      .post('/admin/login')
      .send({ emailOrUsername: 'missing@gmail.com', password: '123456' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Invalid email or username/);
  });

  // ✅ Get Admin by Email
  test('✅ get admin by gmail email', async () => {
    pool.query = jest.fn(async () => ({
      rows: [{
        id: 1,
        username: 'admin1',
        email: 'admin1@gmail.com'
      }]
    }));

    const res = await request(app).get('/admin/email/admin1@gmail.com');
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('admin1');
  });

  test('❌ get admin by non-gmail email', async () => {
    const res = await request(app).get('/admin/email/user@yahoo.com');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Only gmail.com/);
  });

  test('❌ admin not found', async () => {
    pool.query = jest.fn(async () => ({ rows: [] }));

    const res = await request(app).get('/admin/email/missing@gmail.com');
    expect(res.status).toBe(404);
  });

  // ✅ Get All Admins
  test('✅ get all admins', async () => {
    pool.query = jest.fn(async () => ({
      rows: [
        { id: 1, username: 'admin1', email: 'a@gmail.com' },
        { id: 2, username: 'admin2', email: 'b@gmail.com' }
      ]
    }));

    const res = await request(app).get('/admin/all');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  // ✅ Dashboard Stats
  test('✅ get dashboard stats', async () => {
    const mockData = [
      { rows: [{ count: '5' }] },   // products
      { rows: [{ count: '10' }] },  // tables
      { rows: [{ count: '3' }] },   // bookings
      { rows: [{ count: '20' }] },  // users
    ];

    let callIndex = 0;
    pool.query = jest.fn(async () => mockData[callIndex++]);

    const res = await request(app).get('/admin/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      products: 5,
      tables: 10,
      bookingsToday: 3,
      users: 20
    });
  });

  // ✅ Recent Activities
  test('✅ get recent activities', async () => {
    pool.query = jest.fn(async () => ({
      rows: [
        { id: 1, type: 'login', message: 'Logged in', timestamp: '2025-07-24T10:00:00Z' }
      ]
    }));

    const res = await request(app).get('/admin/activities');
    expect(res.status).toBe(200);
    expect(res.body[0].type).toBe('login');
  });

  // ✅ Delete Activity
  test('✅ delete recent activity', async () => {
    pool.query = jest.fn(async () => ({
      rowCount: 1,
      rows: [{ id: 1, message: 'deleted' }]
    }));

    const res = await request(app).delete('/admin/activities/1');
    expect(res.status).toBe(200);
    expect(res.body.deletedActivity.message).toBe('deleted');
  });

});
