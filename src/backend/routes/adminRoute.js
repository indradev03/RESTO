import express from 'express';
import {
  adminLogin,
  getAdminByEmail,
  getAllAdmins,
  getAdminDashboardStats,
  getRecentActivities, // ✅ Added
  deleteRecentActivity,
} from '../controllers/adminController.js';

import {
  getUsers,
  getById,
  update,
  deleteById,
  updateUserImage,
} from '../controllers/userController.js';

import upload from '../middleware/upload.js'; // ✅ Already correct

const router = express.Router();

// 🔐 Admin Authentication
router.post('/login', adminLogin);

// 📊 Dashboard statistics
router.get('/stats', getAdminDashboardStats);

// 📩 Get admin by email
router.get('/email/:email', getAdminByEmail);

// 📋 Get all admins
router.get('/', getAllAdmins);

// 🆕 Recent Activities
router.get('/recent-activities', getRecentActivities);
// Delete recent activity by id
router.delete('/recent-activities/:id', deleteRecentActivity);


// --- User management routes under /users ---
router.get('/users', getUsers);
router.get('/users/:user_id', getById);
router.put('/users/:user_id', update);
router.delete('/users/:user_id', deleteById);
router.put('/users/:user_id/image', upload.single('profileImage'), updateUserImage);

export default router;
