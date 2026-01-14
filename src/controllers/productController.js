import { db } from '../db.js';

export const getAllProducts = (req, res) => {
  res.status(200).json(db.products);
};

export const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const product = db.products.find(p => p.id === id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: 'Produto não encontrado' });
  }
};

export const createProduct = (req, res) => {
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

  const newProduct = {
    id: db._sequences.products++,
    name,
    value: parseFloat(value).toFixed(2)
  };

  db.products.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const { name, value } = req.body;
  const index = db.products.findIndex(p => p.id === id);

  if (index !== -1) {
    const product = db.products[index];
    // Partial update (PATCH-like behavior) for UPDATE requirement
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

    res.status(200).json(product);
  } else {
    res.status(404).json({ error: 'Produto não encontrado para atualização' });
  }
};

export const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }
  const index = db.products.findIndex(p => p.id === id);

  if (index !== -1) {
    db.products.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Produto não encontrado para remoção' });
  }
};
