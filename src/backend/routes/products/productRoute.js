import express from 'express';
import upload from '../../middleware/upload.js';
import {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from '../../controllers/productController.js';

const router = express.Router();

router.post('/', upload.single('image'), addProduct);
router.get('/', getProducts);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
