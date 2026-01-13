import { db } from '../db.js';

export const getAllCustomers = (req, res) => {
  res.json(db.customers);
};

export const getCustomerById = (req, res) => {
  const id = parseInt(req.params.id);
  const customer = db.customers.find(c => c.id === id);

  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ error: 'Cliente não encontrado' });
  }
};

export const createCustomer = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  // Basic email validation (simple regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  const newCustomer = {
    id: db._sequences.customers++,
    name,
    email
  };

  db.customers.push(newCustomer);
  res.status(201).json(newCustomer);
};

export const updateCustomer = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const index = db.customers.findIndex(c => c.id === id);

  if (index !== -1) {
    const customer = db.customers[index];

    if (name) customer.name = name;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
      }
      customer.email = email;
    }

    res.json(customer);
  } else {
    res.status(404).json({ error: 'Cliente não encontrado para atualização' });
  }
};

export const deleteCustomer = (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.customers.findIndex(c => c.id === id);

  if (index !== -1) {
    db.customers.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Cliente não encontrado para remoção' });
  }
};
