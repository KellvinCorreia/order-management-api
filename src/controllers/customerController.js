import { db } from '../db.js';

export const getAllCustomers = (req, res) => {
  res.status(200).json(db.customers);
};

export const getCustomerById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const customer = db.customers.find(c => c.id === id);

  if (customer) {
    res.status(200).json(customer);
  } else {
    res.status(404).json({ error: 'Cliente não encontrado' });
  }
};

export const createCustomer = (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res
      .status(400)
      .json({ error: 'Nome é obrigatório e deve ser uma string não vazia.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
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
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const { name, email } = req.body;
  const index = db.customers.findIndex(c => c.id === id);

  if (index !== -1) {
    const customer = db.customers[index];

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res
          .status(400)
          .json({ error: 'Nome deve ser uma string não vazia.' });
      }
      customer.name = name;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
      }
      customer.email = email;
    }

    res.status(200).json(customer);
  } else {
    res.status(404).json({ error: 'Cliente não encontrado para atualização' });
  }
};

export const deleteCustomer = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const index = db.customers.findIndex(c => c.id === id);

  if (index !== -1) {
    db.customers.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Cliente não encontrado para remoção' });
  }
};
