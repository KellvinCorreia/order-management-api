export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Order Management API',
    version: '1.0.0',
    description: 'API para gerenciamento de Produtos, Clientes e Pedidos.'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor Local'
    }
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Mouse' },
          value: { type: 'string', example: '50.00' }
        }
      },
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'João' },
          email: { type: 'string', example: 'joao@email.com' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          customerId: { type: 'integer', example: 1 },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                quantity: { type: 'integer' }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/product': {
      get: {
        tags: ['Products'],
        summary: 'Listar todos os produtos',
        responses: {
          200: {
            description: 'Lista de produtos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Criar novo produto',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  value: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Produto criado' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/product/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obter produto por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Produto encontrado' },
          404: { description: 'Produto não encontrado' }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Atualizar produto',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          200: { description: 'Produto atualizado' },
          404: { description: 'Produto não encontrado' }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Deletar produto',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          204: { description: 'Produto deletado' },
          404: { description: 'Produto não encontrado' }
        }
      }
    },
    '/customer': {
      get: {
        tags: ['Customers'],
        summary: 'Listar todos os clientes',
        responses: { 200: { description: 'Lista de clientes' } }
      },
      post: {
        tags: ['Customers'],
        summary: 'Criar novo cliente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Cliente criado' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/customer/{id}': {
      get: {
        tags: ['Customers'],
        summary: 'Obter cliente por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Cliente encontrado' },
          404: { description: 'Cliente não encontrado' }
        }
      },
      put: {
        tags: ['Customers'],
        summary: 'Atualizar cliente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Customer' }
            }
          }
        },
        responses: { 200: { description: 'Cliente atualizado' } }
      },
      delete: {
        tags: ['Customers'],
        summary: 'Deletar cliente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: { 204: { description: 'Cliente deletado' } }
      }
    },
    '/order': {
      get: {
        tags: ['Orders'],
        summary: 'Listar todos os pedidos',
        responses: { 200: { description: 'Lista de pedidos' } }
      },
      post: {
        tags: ['Orders'],
        summary: 'Criar novo pedido',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' }
            }
          }
        },
        responses: {
          201: { description: 'Pedido criado' },
          400: { description: 'Erro de validação (Produto ou Cliente)' }
        }
      }
    },
    '/order/search': {
      get: {
        tags: ['Orders'],
        summary: 'Pesquisar pedidos',
        parameters: [
          {
            name: 'product_id',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Filtrar por ID do produto'
          },
          {
            name: 'customer_id',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Filtrar por ID do cliente'
          }
        ],
        responses: { 200: { description: 'Lista filtrada' } }
      }
    },
    '/order/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Obter pedido por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Pedido encontrado' },
          404: { description: 'Pedido não encontrado' }
        }
      },
      put: {
        tags: ['Orders'],
        summary: 'Atualizar pedido',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' }
            }
          }
        },
        responses: { 200: { description: 'Pedido atualizado' } }
      },
      delete: {
        tags: ['Orders'],
        summary: 'Deletar pedido',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: { 204: { description: 'Pedido deletado' } }
      }
    }
  }
};
