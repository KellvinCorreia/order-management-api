import customerDb, { getNextCustomerId } from '../database/customerDb.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerDb.values().all();
    // Filtra apenas objetos válidos (ignora a sequence key)
    const validCustomers = customers.filter(c => typeof c === 'object' && c.id);
    res.status(200).json(validCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar clientes.' });
  }
};

export const getCustomerById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    const customer = await customerDb.get(id.toString());
    res.status(200).json(customer);
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno.' });
  }
};

export const createCustomer = async (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res
      .status(400)
      .json({ error: 'Nome é obrigatório e deve ser uma string não vazia.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  try {
    const newId = await getNextCustomerId();
    const newCustomer = {
      id: newId,
      name,
      email
    };

    await customerDb.put(newId.toString(), newCustomer);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  }
};

export const updateCustomer = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const { name, email } = req.body;

  try {
    const customer = await customerDb.get(id.toString());

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

    await customerDb.put(id.toString(), customer);
    res.status(200).json(customer);
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res
        .status(404)
        .json({ error: 'Cliente não encontrado para atualização' });
    }
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  }
};

export const deleteCustomer = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    await customerDb.get(id.toString());
    await customerDb.del(id.toString());
    res.status(204).send();
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res
        .status(404)
        .json({ error: 'Cliente não encontrado para remoção' });
    }
    res.status(500).json({ error: 'Erro ao deletar cliente.' });
  }
};
