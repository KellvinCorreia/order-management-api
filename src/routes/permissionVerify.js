import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const { SECRET_KEY } = config;

const permissionVerify = (req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token) {
    return res.status(401).send({
      error: 'Acesso negado. Token não fornecido.',
      suggestion: 'Realize login em http://localhost:3000/'
    });
  }

  try {
    const decoded = jwt.verify(access_token, SECRET_KEY);
    req.user = decoded; // Salva dados do usuário na requisição
    next(); // Permite acesso
  } catch (error) {
    return res.status(403).send({
      error: 'Token inválido ou expirado.',
      suggestion: 'Realize login novamente.'
    });
  }
};

export default permissionVerify;
