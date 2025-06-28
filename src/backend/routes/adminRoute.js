import express from 'express';
import {
    adminLogin,
    getAdminByEmail,
    getAllAdmins
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/email/:email', getAdminByEmail);
router.get('/', getAllAdmins); // 👈 New route to fetch all admins

export default router;
