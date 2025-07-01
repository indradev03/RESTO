import express from 'express';
import tableRoutes from './table/tableRoute.js';
import productRoutes from './product/productRoute.js'; // ✅ Import product routes

const router = express.Router();

router.use('/tables', tableRoutes);
router.use('/products', productRoutes); // ✅ Mount product routes under /api/products

export default router;
