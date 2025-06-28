import express from 'express';
import upload from '../../middleware/upload.js';
import {
  addTable,
  getTables,
  updateTable,
  deleteTable,
} from '../../controllers/tableController.js';

const router = express.Router();

router.post('/', upload.single('image'), addTable);
router.get('/', getTables);
router.put('/:id', upload.single('image'), updateTable);
router.delete('/:id', deleteTable);

export default router;
