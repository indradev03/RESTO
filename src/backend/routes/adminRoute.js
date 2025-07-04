import express from 'express';
import {
  adminLogin,
  getAdminByEmail,
  getAllAdmins,
  getAdminDashboardStats,
} from '../controllers/adminController.js';

const router = express.Router();

// 🔐 Admin Authentication
router.post('/login', adminLogin);

// 📊 Dashboard statistics (MUST BE BEFORE '/')
router.get('/stats', getAdminDashboardStats);


// 📩 Get admin by email
router.get('/email/:email', getAdminByEmail);

// 📋 Get all admins
router.get('/', getAllAdmins);

export default router;
