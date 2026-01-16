import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import permissionVerify from './permissionVerify.js';

const router = express.Router();

router.use(permissionVerify);

router.get('/product', getAllProducts);
router.get('/product/:id', getProductById);
router.post('/product', createProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

export default router;
