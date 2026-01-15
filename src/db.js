export const db = {
  products: [],
  orders: [],
  customers: [],
  users: [
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
  ],
  _sequences: {
    products: 1,
    orders: 1,
    customers: 1,
    users: 3
  }
};
