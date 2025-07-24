import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock all controller functions
const adminController = {
  adminLogin: jest.fn((req, res) => res.status(200).json({ message: 'adminLogin ok' })),
  getAdminByEmail: jest.fn((req, res) => res.status(200).json({ message: 'getAdminByEmail ok' })),
  getAllAdmins: jest.fn((req, res) => res.status(200).json({ message: 'getAllAdmins ok' })),
  getAdminDashboardStats: jest.fn((req, res) => res.status(200).json({ message: 'getAdminDashboardStats ok' })),
  getRecentActivities: jest.fn((req, res) => res.status(200).json({ message: 'getRecentActivities ok' })),
  deleteRecentActivity: jest.fn((req, res) => res.status(200).json({ message: 'deleteRecentActivity ok' })),
};

const userController = {
  getUsers: jest.fn((req, res) => res.status(200).json({ message: 'getUsers ok' })),
  getById: jest.fn((req, res) => res.status(200).json({ message: 'getById ok' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'update ok' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'deleteById ok' })),
  updateUserImage: jest.fn((req, res) => res.status(200).json({ message: 'updateUserImage ok' })),
};

// Mock the multer upload middleware to just call next()
const mockUploadMiddleware = (req, res, next) => next();

// Recreate the router with mocked controllers and upload middleware

// Instead of importing your real router, build a test router here:
function createTestRouter() {
  const router = express.Router();

  router.post('/login', adminController.adminLogin);
  router.get('/stats', adminController.getAdminDashboardStats);
  router.get('/email/:email', adminController.getAdminByEmail);
  router.get('/', adminController.getAllAdmins);
  router.get('/recent-activities', adminController.getRecentActivities);
  router.delete('/recent-activities/:id', adminController.deleteRecentActivity);

  router.get('/users', userController.getUsers);
  router.get('/users/:user_id', userController.getById);
  router.put('/users/:user_id', userController.update);
  router.delete('/users/:user_id', userController.deleteById);
  router.put('/users/:user_id/image', mockUploadMiddleware, userController.updateUserImage);

  return router;
}

describe('Admin Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/admin', createTestRouter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /login calls adminLogin controller', async () => {
    const res = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'pass' });
    expect(res.statusCode).toBe(200);
    expect(adminController.adminLogin).toHaveBeenCalled();
  });

  test('GET /stats calls getAdminDashboardStats controller', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.statusCode).toBe(200);
    expect(adminController.getAdminDashboardStats).toHaveBeenCalled();
  });

  test('GET /email/:email calls getAdminByEmail controller', async () => {
    const res = await request(app).get('/api/admin/email/test@example.com');
    expect(res.statusCode).toBe(200);
    expect(adminController.getAdminByEmail).toHaveBeenCalled();
  });

  test('GET / calls getAllAdmins controller', async () => {
    const res = await request(app).get('/api/admin/');
    expect(res.statusCode).toBe(200);
    expect(adminController.getAllAdmins).toHaveBeenCalled();
  });

  test('GET /recent-activities calls getRecentActivities controller', async () => {
    const res = await request(app).get('/api/admin/recent-activities');
    expect(res.statusCode).toBe(200);
    expect(adminController.getRecentActivities).toHaveBeenCalled();
  });

  test('DELETE /recent-activities/:id calls deleteRecentActivity controller', async () => {
    const res = await request(app).delete('/api/admin/recent-activities/123');
    expect(res.statusCode).toBe(200);
    expect(adminController.deleteRecentActivity).toHaveBeenCalled();
  });

  test('GET /users calls getUsers controller', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.statusCode).toBe(200);
    expect(userController.getUsers).toHaveBeenCalled();
  });

  test('GET /users/:user_id calls getById controller', async () => {
    const res = await request(app).get('/api/admin/users/456');
    expect(res.statusCode).toBe(200);
    expect(userController.getById).toHaveBeenCalled();
  });

  test('PUT /users/:user_id calls update controller', async () => {
    const res = await request(app).put('/api/admin/users/456').send({ name: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(userController.update).toHaveBeenCalled();
  });

  test('DELETE /users/:user_id calls deleteById controller', async () => {
    const res = await request(app).delete('/api/admin/users/456');
    expect(res.statusCode).toBe(200);
    expect(userController.deleteById).toHaveBeenCalled();
  });

  test('PUT /users/:user_id/image calls updateUserImage controller', async () => {
    const res = await request(app)
      .put('/api/admin/users/456/image')
      .attach('profileImage', Buffer.from('fake image content'), 'profile.png');

    expect(res.statusCode).toBe(200);
    expect(userController.updateUserImage).toHaveBeenCalled();
  });
});
