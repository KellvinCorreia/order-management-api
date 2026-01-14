import { db } from '../db.js';

export const getAllOrders = (req, res) => {
  res.json(db.orders);
};

export const getOrderById = (req, res) => {
  const id = parseInt(req.params.id);
  const order = db.orders.find(o => o.id === id);

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado' });
  }
};

export const createOrder = (req, res) => {
  const { items, customerId } = req.body;

  // Validação do Cliente
  if (!customerId) {
    return res.status(400).json({ error: 'O ID do cliente é obrigatório.' });
  }

  const customerExists = db.customers.find(c => c.id === customerId);
  if (!customerExists) {
    return res.status(400).json({ error: 'Cliente não encontrado.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: 'O pedido deve conter uma lista de itens.' });
  }

  // Validação: Verificar se os produtos existem
  for (const item of items) {
    const productExists = db.products.find(p => p.id === item.id);
    if (!productExists) {
      return res
        .status(400)
        .json({ error: `Produto com ID ${item.id} não encontrado.` });
    }
  }

  const newOrder = {
    id: db._sequences.orders++,
    customerId,
    items // items structure: [{ id: productId, quantity: number }]
  };

  db.orders.push(newOrder);
  res.status(201).json(newOrder);
};

export const updateOrder = (req, res) => {
  const id = parseInt(req.params.id);
  const { items } = req.body;
  const index = db.orders.findIndex(o => o.id === id);

  if (index !== -1) {
    if (items && Array.isArray(items)) {
      // Re-validar produtos na atualização
      for (const item of items) {
        const productExists = db.products.find(p => p.id === item.id);
        if (!productExists) {
          return res
            .status(400)
            .json({ error: `Produto com ID ${item.id} não encontrado.` });
        }
      }
      db.orders[index].items = items;
    }
    res.json(db.orders[index]);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado para atualização' });
  }
};

export const deleteOrder = (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.orders.findIndex(o => o.id === id);

  if (index !== -1) {
    db.orders.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Pedido não encontrado para remoção' });
  }
};
