// routes/user.js
import express from 'express';
import { getUsers, getById, update, deleteById } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteById);

export default router;
