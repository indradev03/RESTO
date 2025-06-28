import express from 'express';
import tableRoutes from './tableRoute.js';

const router = express.Router();
router.use('/tables', tableRoutes);

export default router;
