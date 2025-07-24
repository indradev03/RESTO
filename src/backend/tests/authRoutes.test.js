import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock controller functions
const authController = {
  signup: jest.fn((req, res) => res.status(201).json({ message: 'signup ok' })),
  login: jest.fn((req, res) => res.status(200).json({ message: 'login ok' })),
  forgotPassword: jest.fn((req, res) => res.status(200).json({ message: 'forgotPassword ok' })),
  resetPassword: jest.fn((req, res) => res.status(200).json({ message: 'resetPassword ok' })),
};

// Create test router with mocked controllers
function createTestRouter() {
  const router = express.Router();

  router.post('/signup', authController.signup);
  router.post('/login', authController.login);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);

  return router;
}

describe('Auth Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', createTestRouter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /signup calls signup controller', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.statusCode).toBe(201);
    expect(authController.signup).toHaveBeenCalled();
  });

  test('POST /login calls login controller', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(authController.login).toHaveBeenCalled();
  });

  test('POST /forgot-password calls forgotPassword controller', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'test@example.com' });

    expect(res.statusCode).toBe(200);
    expect(authController.forgotPassword).toHaveBeenCalled();
  });

  test('POST /reset-password calls resetPassword controller', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'reset-token', password: 'newpass123' });

    expect(res.statusCode).toBe(200);
    expect(authController.resetPassword).toHaveBeenCalled();
  });
});
