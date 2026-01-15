import { ClassicLevel } from 'classic-level';
import path from 'path';

const dbPath = path.resolve('./auth_db');
const authDb = new ClassicLevel(dbPath, { valueEncoding: 'json' });

const seedDb = async () => {
  try {
    await authDb.get('admin');
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      console.log('Banco de Auth vazio. Criando usuários padrão...');

      const users = [
        {
          id: 1,
          user: 'admin',
          pwd: '$2b$10$Fvyoi/SjiXWolgEKe5Zl7..nUBx4pqeWboJhCK7D.8BNM6pQHpsr.',
          userType: ['admin']
        },
        {
          id: 2,
          user: 'user',
          pwd: '$2b$10$SDLEMPsxSoJ3m661rzLLZOxkFi/G.JWCLjYRXH7ftXfIGJMmzWSDW',
          userType: ['user']
        }
      ];

      for (const u of users) {
        await authDb.put(u.user, u);
      }
      console.log('Usuários criados com sucesso.');
    } else {
      console.error('Erro ao verificar DB:', error);
    }
  }
};

seedDb();

export default authDb;
