import { ClassicLevel } from 'classic-level';
import path from 'path';

const dbPath = path.resolve('./order_db');
const orderDb = new ClassicLevel(dbPath, { valueEncoding: 'json' });

const SEQUENCE_KEY = '!sequence!';

const initOrderDb = async () => {
  try {
    await orderDb.open();

    try {
      await orderDb.get(SEQUENCE_KEY);
    } catch (err) {
      if (err.code === 'LEVEL_NOT_FOUND') {
        console.log('Banco de Pedidos vazio. Iniciando seed...');

        await orderDb.put(SEQUENCE_KEY, 0);

        console.log('DB de Pedidos inicializado.');
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar OrderDB:', error);
  }
};

const getNextOrderId = async () => {
  try {
    const current = await orderDb.get(SEQUENCE_KEY);
    const next = current + 1;
    await orderDb.put(SEQUENCE_KEY, next);
    return next;
  } catch (error) {
    throw new Error('Falha ao gerar ID de pedido');
  }
};

export { initOrderDb, getNextOrderId };
export default orderDb;
