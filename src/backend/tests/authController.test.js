import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { signup, login } from '../controllers/authController.js';


// Mock bcryptjs so compare returns true only for correct password/hash pair
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('mocked_hashed_password')),
  compare: jest.fn((plain, stored) => {
    if (plain === 'Test@1234' && stored === 'mocked_hashed_password') {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }),
}));

// Mock jsonwebtoken to always return fixed token
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_jwt_token'),
}));

// Mock nodemailer transport to avoid sending real emails
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve()),
  })),
}));

// Mock database pool query function
jest.mock('../database/db.js', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

import pool from '../database/db.js';

// --- SETUP EXPRESS APP ---

const app = express();
app.use(express.json());
app.post('/signup', signup);
app.post('/login', login);

// Clear mocks before each test to avoid interference
beforeEach(() => {
  jest.clearAllMocks();
});

// --- TESTS ---

describe('POST /signup', () => {
  test('✅ success signup', async () => {
    let callCount = 0;
    pool.query = jest.fn(async () => {
      callCount++;
      if (callCount === 1) return { rows: [] }; // no existing user found
      if (callCount === 2) return { rows: [{ user_id: 1, name: 'Test', email: 'test@gmail.com', role: 'user', contact: '9876543210', address: 'Kathmandu' }] }; // insert user returns user
      if (callCount === 3) return {}; // log activity
      return {};
    });

    const response = await request(app).post('/signup').send({
      name: 'Test',
      email: 'test@gmail.com',
      password: 'Test@1234',
      contact: '9876543210',
      address: 'Kathmandu',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.name).toBe('Test');
  });

  test('❌ signup fails with missing name', async () => {
    const response = await request(app).post('/signup').send({
      name: '',
      email: 'test@gmail.com',
      password: 'Test@1234',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Name is required');
  });

  test('❌ signup fails with already registered email', async () => {
    pool.query = jest.fn(async () => ({ rows: [{ exists: true }] }));

    const response = await request(app).post('/signup').send({
      name: 'Test',
      email: 'test@gmail.com',
      password: 'Test@1234',
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('Email is already registered');
  });
});

describe('POST /login', () => {
  test('✅ success login', async () => {
    pool.query = jest.fn(async (_queryText, values) => {
      if (values && values[0] === 'test@gmail.com') {
        return {
          rows: [{
            user_id: 1,
            name: 'Test',
            email: 'test@gmail.com',
            password: 'mocked_hashed_password', // must match bcrypt mock
            role: 'user',
            contact: '9876543210',
            address: 'Kathmandu',
          }],
        };
      }
      return { rows: [] };
    });

    const response = await request(app).post('/api/users/login').send({
      email: 'test@gmail.com',
      password: 'Test@1234', // correct password
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user.name).toBe('Test');
  });

  test('❌ login fails with wrong password', async () => {
    pool.query = jest.fn(async (_queryText, values) => {
      if (values && values[0] === 'test@gmail.com') {
        return {
          rows: [{
            user_id: 1,
            email: 'test@gmail.com',
            password: 'mocked_hashed_password',
          }],
        };
      }
      return { rows: [] };
    });

    const response = await request(app).post('/login').send({
      email: 'test@gmail.com',
      password: 'wrongPassword', // wrong password
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Incorrect password');
  });

  test('❌ login fails with unregistered email', async () => {
    pool.query = jest.fn(async () => ({ rows: [] }));

    const response = await request(app).post('/login').send({
      email: 'notfound@gmail.com',
      password: 'anyPassword',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Email is not registered');
  });
});
