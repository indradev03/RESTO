import express from 'express';
import upload from '../middleware/upload.js'; // multer middleware for file uploads
import {
    getUsers,
    getById,
    update,
    deleteById,
    updateUserImage,
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/       - Get all users (safe fields)
router.get('/', getUsers);

// GET /api/users/:id    - Get user by ID
router.get('/:id', getById);

// PUT /api/users/:id    - Update user details (excluding image)
router.put('/:id', update);

// DELETE /api/users/:id - Delete user by ID
router.delete('/:id', deleteById);

// PUT /api/users/:id/profile-image - Update user's profile image
router.put('/:id/profile-image', upload.single('profileImage'), updateUserImage);

export default router;
