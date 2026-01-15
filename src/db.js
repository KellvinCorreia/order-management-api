export const db = {
  products: [],
  orders: [],
  customers: [],
  users: [
    { id: 1, user: 'admin', pwd: '123', userType: ['admin'] },
    { id: 2, user: 'user', pwd: '123', userType: ['user'] }
  ],
  _sequences: {
    products: 1,
    orders: 1,
    customers: 1,
    users: 3
  }
};
