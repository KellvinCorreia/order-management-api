import { ClassicLevel } from 'classic-level';
import path from 'path';

const dbPath = path.resolve('./product_db');
const productDb = new ClassicLevel(dbPath, { valueEncoding: 'json' });

const SEQUENCE_KEY = '!sequence!';

const initProductDb = async () => {
  try {
    await productDb.open();

    try {
      await productDb.get(SEQUENCE_KEY);
    } catch (err) {
      if (err.code === 'LEVEL_NOT_FOUND') {
        console.log('Banco de Produtos vazio. Iniciando seed...');

        const products = [
          {
            id: 1,
            name: 'Pizza',
            description: 'Mussarela',
            price: 85.0,
            image: ''
          },
          {
            id: 2,
            name: 'X-Salada',
            description: 'Hamburguer, Queijo, Alface',
            price: 18.5,
            image: ''
          }
        ];

        for (const p of products) {
          await productDb.put(p.id.toString(), p);
        }

        await productDb.put(SEQUENCE_KEY, 2);

        console.log('Produtos seedados com sucesso.');
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar ProductDB:', error);
  }
};

const getNextId = async () => {
  try {
    const current = await productDb.get(SEQUENCE_KEY);
    const next = current + 1;
    await productDb.put(SEQUENCE_KEY, next);
    return next;
  } catch (error) {
    throw new Error('Falha ao gerar ID de produto');
  }
};

export { initProductDb, getNextId };
export default productDb;
