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

// GET /api/users/              - Get all users (safe fields)
router.get('/', getUsers);

// GET /api/users/:user_id      - Get user by user_id
router.get('/:user_id', getById);

// PUT /api/users/:user_id      - Update user details (excluding image)
router.put('/:user_id', update);

// DELETE /api/users/:user_id   - Delete user by user_id
router.delete('/:user_id', deleteById);

// PUT /api/users/:user_id/profile-image - Update user's profile image
router.put('/:user_id/profile-image', upload.single('profileImage'), updateUserImage);

export default router;
