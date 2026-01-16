import { ClassicLevel } from 'classic-level';
import path from 'path';

const dbPath = path.resolve('./customer_db');
const customerDb = new ClassicLevel(dbPath, { valueEncoding: 'json' });

const SEQUENCE_KEY = '!sequence!';

const initCustomerDb = async () => {
  try {
    await customerDb.open();

    try {
      await customerDb.get(SEQUENCE_KEY);
    } catch (err) {
      if (err.code === 'LEVEL_NOT_FOUND') {
        console.log('Banco de Clientes vazio. Iniciando seed...');

        const customers = [
          { id: 1, name: 'João Silva', email: 'joao@example.com' },
          { id: 2, name: 'Maria Souza', email: 'maria@example.com' }
        ];

        for (const c of customers) {
          await customerDb.put(c.id.toString(), c);
        }

        await customerDb.put(SEQUENCE_KEY, 2);

        console.log('Clientes seedados com sucesso.');
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar CustomerDB:', error);
  }
};

const getNextCustomerId = async () => {
  try {
    const current = await customerDb.get(SEQUENCE_KEY);
    const next = current + 1;
    await customerDb.put(SEQUENCE_KEY, next);
    return next;
  } catch (error) {
    throw new Error('Falha ao gerar ID de cliente');
  }
};

export { initCustomerDb, getNextCustomerId };
export default customerDb;
