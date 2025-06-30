// routes/user.js
import express from 'express';
import { getUsers, getById, update, deleteById} from '../controllers/userController.js';
// import { singup } from '../controllers/authController.js';
const router = express.Router();


// router.post('/', singup);

router.get('/', getUsers);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteById);

export default router;
