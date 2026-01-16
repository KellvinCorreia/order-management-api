import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import loginRoutes from './routes/loginRoutes.js';
import authDb, { initDb } from './database/authDb.js';
import productDb, { initProductDb } from './database/productDb.js';
import orderDb, { initOrderDb } from './database/orderDb.js';
import customerDb, { initCustomerDb } from './database/customerDb.js';

const app = express();
const port = process.env.PORT;

const allowedOrigin = 'http://localhost:3000';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../web')));
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
);

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
});

app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', loginRoutes);
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: 'Erro interno do servidor. Tente novamente mais tarde.' });
});

const startServer = async () => {
  try {
    await initDb();
    await initProductDb();
    await initOrderDb();
    await initCustomerDb();
    const server = app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });

    const shutdown = async () => {
      console.log('\n🛑 Encerrando servidor com segurança...');

      server.close(() => {
        console.log('❌ Servidor HTTP fechado.');
      });

      try {
        await authDb.close();
        await productDb.close();
        await orderDb.close();
        await customerDb.close();
        console.log('✅ Bancos de dados fechados com sucesso.');
        process.exit(0);
      } catch (err) {
        console.error('Erro ao fechar bancos:', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Falha crítica ao iniciar:', error);
    process.exit(1);
  }
};

startServer();
