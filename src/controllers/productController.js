import productDb, { getNextId } from '../database/productDb.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await productDb.values().all();
    const validProducts = products.filter(p => typeof p === 'object' && p.id);
    res.status(200).json(validProducts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos.' });
  }
};

export const getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    const product = await productDb.get(id.toString());
    res.status(200).json(product);
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno.' });
  }
};

export const createProduct = async (req, res) => {
  const { name, value } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res
      .status(400)
      .json({ error: 'Nome é obrigatório e deve ser uma string não vazia.' });
  }

  if (
    value === undefined ||
    typeof value !== 'number' ||
    isNaN(value) ||
    value <= 0
  ) {
    return res
      .status(400)
      .json({ error: 'Valor é obrigatório e deve ser numérico.' });
  }

  try {
    const newId = await getNextId();
    const newProduct = {
      id: newId,
      name,
      value: parseFloat(value).toFixed(2)
    };

    await productDb.put(newId.toString(), newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto.' });
  }
};

export const updateProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const { name, value } = req.body;

  try {
    const product = await productDb.get(id.toString());

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res
          .status(400)
          .json({ error: 'Nome deve ser uma string não vazia.' });
      }
      product.name = name;
    }

    if (value !== undefined) {
      if (typeof value !== 'number' || isNaN(value) || value <= 0) {
        return res.status(400).json({ error: 'Valor deve ser numérico.' });
      }
      product.value = parseFloat(value).toFixed(2);
    }

    await productDb.put(id.toString(), product);
    res.status(200).json(product);
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res
        .status(404)
        .json({ error: 'Produto não encontrado para atualização' });
    }
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
};

export const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    await productDb.get(id.toString());
    await productDb.del(id.toString());
    res.status(204).send();
  } catch (error) {
    if (error.code === 'LEVEL_NOT_FOUND') {
      return res
        .status(404)
        .json({ error: 'Produto não encontrado para remoção' });
    }
    res.status(500).json({ error: 'Erro ao deletar produto.' });
  }
};
