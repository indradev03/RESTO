import express from 'express';
import tableRoutes from './table/tableRoute.js';
import productRoutes from './product/productRoute.js';
import bookingRoutes from './booking/bookingRoutes.js';  // Import booking routes

const router = express.Router();

router.use('/tables', tableRoutes);
router.use('/products', productRoutes);
router.use('/bookings', bookingRoutes);  // Mount booking routes under /api/bookings

export default router;
