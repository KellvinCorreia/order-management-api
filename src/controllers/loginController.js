import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { db } from '../db.js';

const { SECRET_KEY } = config;

// --- LOGIN (POST /api/login) ---
export const createLogin = (req, res) => {
  const { user, pwd } = req.body;

  const foundUser = db.users.find(u => u.user === user && u.pwd === pwd);

  if (!foundUser) {
    return res.status(401).send({ error: 'Usuário ou senha incorretos.' });
  }

  const payload = {
    id: foundUser.id,
    user: foundUser.user,
    role: foundUser.userType
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

  res.cookie('access_token', token, { httpOnly: true });

  res.status(200).send({
    message: 'Login realizado com sucesso!',
    token: token
  });
};

// --- LOGOUT (POST /api/logout) ---
export const logout = (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
};

// --- GET OWN PROFILE (GET /api/login/) ---
export const getOwnProfile = (req, res) => {
  // req.user vem do middleware permissionVerify
  res.json({ message: 'Seus dados', profile: req.user });
};

// --- GET ALL USERS (GET /api/login/all) - ADMIN ---
export const getAllUsers = (req, res) => {
  // Validação de Admin
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  res.json(db.users);
};

// --- GET USER BY USERNAME (GET /api/login/:username) - ADMIN ---
export const getUserByUsername = (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;
  const user = db.users.find(u => u.user === username);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
};

// --- UPDATE USER (PUT /api/login/:username) - ADMIN ---
export const updateUser = (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;
  const { pwd, userType } = req.body;

  const user = db.users.find(u => u.user === username);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (pwd) user.pwd = pwd;
  if (userType) user.userType = userType; // Ex: ['admin'] ou ['user']

  res.json({ message: 'Usuário atualizado', user });
};

// --- DELETE USER (DELETE /api/login/:username) - ADMIN ---
export const deleteUser = (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;

  const index = db.users.findIndex(u => u.user === username);
  if (index === -1)
    return res.status(404).json({ error: 'Usuário não encontrado' });

  db.users.splice(index, 1);
  res.status(204).send();
};
