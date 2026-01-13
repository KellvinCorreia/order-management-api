import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
