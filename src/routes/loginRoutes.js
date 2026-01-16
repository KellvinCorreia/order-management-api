import express from 'express';
import {
  createLogin,
  getOwnProfile,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
  logout
} from '../controllers/loginController.js';
import permissionVerify from './permissionVerify.js';

const router = express.Router();

router.post('/login', createLogin);
router.post('/logout', logout);

router.use('/login', permissionVerify);

router.get('/login', getOwnProfile);
router.get('/login/all', getAllUsers);
router.get('/login/:username', getUserByUsername);
router.put('/login/:username', updateUser);
router.delete('/login/:username', deleteUser);

export default router;
