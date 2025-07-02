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
router.get('/:table_id', getTableById);                  // Updated
router.put('/:table_id', upload.single('image'), updateTable);  // Updated
router.delete('/:table_id', deleteTable);                // Updated

export default router;
