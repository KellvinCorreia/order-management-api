import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger.js';
import routes from './routes/index.js';

const app = express();
const port = 3000;

// Configuração de CORS: Bloqueia acesso de outras origens
const allowedOrigin = 'http://localhost:3001';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Middleware de Proteção conta Iframe (Clickjacking)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
});

// Rota de Documentação (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

// Middleware Global de Erro (Catch-all para 500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: 'Erro interno do servidor. Tente novamente mais tarde.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
