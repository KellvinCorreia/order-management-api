import express from 'express';
import orderRoutes from './orderRoutes.js';
// import customerRoutes from './customerRoutes.js';

const router = express.Router();

router.use('/', orderRoutes);
// router.use('/', customerRoutes);

export default router;
