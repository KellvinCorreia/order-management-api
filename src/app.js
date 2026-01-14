import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Middleware de Proteção conta Iframe (Clickjacking)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
