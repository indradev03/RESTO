import express from 'express';
import upload from '../../middleware/upload.js';
import {
  addTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
} from '../../controllers/tableController.js';

const router = express.Router();

router.post('/', upload.single('image'), addTable);
router.get('/', getTables);
router.get('/:id', getTableById);           // <--- Add this for fetching a single table
router.put('/:id', upload.single('image'), updateTable);
router.delete('/:id', deleteTable);

export default router;
