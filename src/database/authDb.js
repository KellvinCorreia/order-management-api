import { ClassicLevel } from 'classic-level';
import path from 'path';

const dbPath = path.resolve('./auth_db');
const authDb = new ClassicLevel(dbPath, { valueEncoding: 'json' });

const initDb = async () => {
  try {
    await authDb.open();
    const users = [
      {
        id: 1,
        user: 'admin',
        pwd: '$2b$10$Fvyoi/SjiXWolgEKe5Zl7..nUBx4pqeWboJhCK7D.8BNM6pQHpsr.', // admin / 123
        userType: ['admin']
      },
      {
        id: 2,
        user: 'user',
        pwd: '$2b$10$SDLEMPsxSoJ3m661rzLLZOxkFi/G.JWCLjYRXH7ftXfIGJMmzWSDW', // user / 123
        userType: ['user']
      }
    ];

    for (const u of users) {
      let exists = false;
      try {
        const existing = await authDb.get(u.user);
        if (existing) exists = true;
      } catch (err) {
        if (err.code !== 'LEVEL_NOT_FOUND') {
          console.error(`Erro ao checar usuário ${u.user}:`, err);
        }
      }

      if (!exists) {
        console.log(`Usuário ${u.user} não encontrado. Criando...`);
        await authDb.put(u.user, u);
      }
    }
    console.log('Verificação de usuários concluída.');
  } catch (error) {
    console.error('Erro ao inicializar AuthDB:', error);
  }
};

export { initDb };
export default authDb;
