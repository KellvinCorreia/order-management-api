import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';

import permissionVerify from './permissionVerify.js';

const router = express.Router();

// Proteção: Todas as rotas abaixo exigem login
router.use(permissionVerify);

router.get('/customer', getAllCustomers);
router.get('/customer/:id', getCustomerById);
router.post('/customer', createCustomer);
router.put('/customer/:id', updateCustomer);
router.delete('/customer/:id', deleteCustomer);

export default router;
