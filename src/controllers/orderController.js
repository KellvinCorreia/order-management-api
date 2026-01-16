import orderDb, { getNextOrderId } from '../database/orderDb.js';
import productDb from '../database/productDb.js';
import customerDb from '../database/customerDb.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderDb.values().all();
    const validOrders = orders.filter(o => typeof o === 'object' && o.id);
    res.status(200).json(validOrders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};

export const getOrderById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    const order = await orderDb.get(id.toString());
    res.status(200).json(order);
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno.' });
  }
};

export const createOrder = async (req, res) => {
  const { items, customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'O ID do cliente é obrigatório.' });
  }

  try {
    await customerDb.get(customerId.toString());
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res.status(400).json({ error: 'Cliente não encontrado.' });
    }
    throw error;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: 'O pedido deve conter uma lista de itens.' });
  }

  try {
    for (const item of items) {
      try {
        await productDb.get(item.id.toString());
      } catch (error) {
        if (error.code === 'LEVEL_NOT_FOUND') {
          return res
            .status(400)
            .json({ error: `Produto com ID ${item.id} não encontrado.` });
        }
        throw error;
      }
    }

    const newId = await getNextOrderId();
    const newOrder = {
      id: newId,
      customerId,
      items
    };

    await orderDb.put(newId.toString(), newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
  }
};

export const updateOrder = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const { items } = req.body;

  try {
    const order = await orderDb.get(id.toString());

    if (items && Array.isArray(items)) {
      for (const item of items) {
        try {
          await productDb.get(item.id.toString());
        } catch (error) {
          if (error.code === 'LEVEL_NOT_FOUND') {
            return res
              .status(400)
              .json({ error: `Produto com ID ${item.id} não encontrado.` });
          }
          throw error;
        }
      }
      order.items = items;
    }

    await orderDb.put(id.toString(), order);
    res.status(200).json(order);
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res
        .status(404)
        .json({ error: 'Pedido não encontrado para atualização' });
    }
    res.status(500).json({ error: 'Erro ao atualizar pedido.' });
  }
};

export const deleteOrder = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    await orderDb.get(id.toString());
    await orderDb.del(id.toString());
    res.status(204).send();
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res
        .status(404)
        .json({ error: 'Pedido não encontrado para remoção' });
    }
    res.status(500).json({ error: 'Erro ao deletar pedido.' });
  }
};

export const searchOrders = async (req, res) => {
  const { product_id, customer_id } = req.query;

  try {
    const allOrders = await orderDb.values().all();
    let result = allOrders.filter(o => typeof o === 'object' && o.id);

    if (product_id) {
      const pId = parseInt(product_id);
      result = result.filter(order =>
        order.items.some(item => item.id === pId)
      );
    }

    if (customer_id) {
      const cId = parseInt(customer_id);
      result = result.filter(order => order.customerId === cId);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro na busca de pedidos.' });
  }
};
