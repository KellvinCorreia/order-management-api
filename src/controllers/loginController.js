import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/index.js';
import authDb from '../database/authDb.js';

const { SECRET_KEY } = config;

export const createLogin = async (req, res) => {
  const { user, pwd } = req.body;

  try {
    const foundUser = await authDb.get(user);

    if (!foundUser) {
      return res.status(401).send({ error: 'Usuário não encontrado.' });
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
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    if (error.code === 'LEVEL_NOT_FOUND' || error.notFound) {
      return res.status(401).send({ error: 'Usuário ou senha incorretos.' });
    }
    return res.status(500).json({ error: 'Erro interno ao logar.' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
};

export const getOwnProfile = (req, res) => {
  res.json({ message: 'Seus dados', profile: req.user });
};
export const getAllUsers = async (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }

  try {
    const users = await authDb.values().all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

export const getUserByUsername = async (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;

  try {
    const user = await authDb.get(username);
    res.json(user);
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno.' });
  }
};

export const updateUser = async (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;
  const { pwd, userType } = req.body;

  try {
    const user = await authDb.get(username);

    if (pwd) {
      const salt = await bcrypt.genSalt(10);
      user.pwd = await bcrypt.hash(pwd, salt);
    }
    if (userType) user.userType = userType;

    await authDb.put(username, user);
    res.json({ message: 'Usuário atualizado', user });
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar.' });
  }
};

export const deleteUser = async (req, res) => {
  if (!req.user.role.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Apenas admins.' });
  }
  const { username } = req.params;

  try {
    await authDb.get(username);
    await authDb.del(username);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao deletar.' });
  }
};
