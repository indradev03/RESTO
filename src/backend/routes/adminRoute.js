import express from 'express';
import {
  adminLogin,
  getAdminByEmail,
  getAllAdmins,
  getAdminDashboardStats,
} from '../controllers/adminController.js';

import {
  getUsers,
  getById,
  update,
  deleteById,
  updateUserImage,
} from '../controllers/userController.js';

const router = express.Router();

// 🔐 Admin Authentication
router.post('/login', adminLogin);

// 📊 Dashboard statistics
router.get('/stats', getAdminDashboardStats);

// 📩 Get admin by email
router.get('/email/:email', getAdminByEmail);

// 📋 Get all admins
router.get('/', getAllAdmins);

// --- User management routes under /users ---

// Get all users
router.get('/users', getUsers);

// Get user by ID
router.get('/users/:user_id', getById);

// Update user by ID
router.put('/users/:user_id', update);

// Delete user by ID
router.delete('/users/:user_id', deleteById);

// Update user profile image by ID (assuming multer middleware for file upload is used)
// Example middleware: upload.single('profileImage')
import upload from '../middleware/upload.js'; // Adjust path

router.put('/users/:user_id/image', upload.single('profileImage'), updateUserImage);

export default router;
