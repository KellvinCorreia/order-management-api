import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  searchOrders
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/order', getAllOrders);
router.get('/order/search', searchOrders);
router.get('/order/:id', getOrderById);
router.post('/order', createOrder);
router.put('/order/:id', updateOrder);
router.delete('/order/:id', deleteOrder);

export default router;
