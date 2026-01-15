import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/index.js';
import { db } from '../db.js';

const { SECRET_KEY } = config;

export const createLogin = async (req, res) => {
  const { user, pwd } = req.body;

  const foundUser = db.users.find(u => u.user === user);

  if (!foundUser) {
    return res.status(401).send({ error: 'Usuário ou senha incorretos.' });
  }

  const match = await bcrypt.compare(pwd, foundUser.pwd);

  if (!match) {
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

export const logout = (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
};

export const getOwnProfile = (req, res) => {
  res.json({ message: 'Seus dados', profile: req.user });
};

export const getAllUsers = (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  res.json(db.users);
};

export const getUserByUsername = (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;
  const user = db.users.find(u => u.user === username);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
};

export const updateUser = async (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;
  const { pwd, userType } = req.body;

  const user = db.users.find(u => u.user === username);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (pwd) {
    const salt = await bcrypt.genSalt(10);
    user.pwd = await bcrypt.hash(pwd, salt);
  }
  if (userType) user.userType = userType;

  res.json({ message: 'Usuário atualizado', user });
};

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
