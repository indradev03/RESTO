// routes/adminRoute.js
import express from 'express';
import { adminLogin } from '../controllers/adminController.js';

const router = express.Router();

// 🔐 Admin login route
router.post('/login', adminLogin);

export default router;
// This route handles admin login requests.
// It uses the adminLogin controller to process the login logic.