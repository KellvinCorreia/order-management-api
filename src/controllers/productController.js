import { db } from '../db.js';

export const getAllProducts = (req, res) => {
  res.json(db.products);
};

export const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = db.products.find(p => p.id === id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Produto não encontrado' });
  }
};

export const createProduct = (req, res) => {
  const { name, value } = req.body;

  if (!name || value === undefined) {
    return res.status(400).json({ error: 'Nome e valor são obrigatórios' });
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
  const { name, value } = req.body;
  const index = db.products.findIndex(p => p.id === id);

  if (index !== -1) {
    const product = db.products[index];
    // Partial update (PATCH-like behavior) for UPDATE requirement
    if (name) product.name = name;
    if (value !== undefined) product.value = parseFloat(value).toFixed(2);

    res.json(product);
  } else {
    res.status(404).json({ error: 'Produto não encontrado para atualização' });
  }
};

export const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.id === id);

  if (index !== -1) {
    db.products.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Produto não encontrado para remoção' });
  }
};
