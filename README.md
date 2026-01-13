# Gestão de Pedidos API

API RESTful simples desenvolvida em Node.js com Express e arquitetura MVC, para gerenciamento de produtos, pedidos e clientes.

## Estrutura do Projeto

O projeto segue o padrão MVC (Model-View-Controller) simplificado:

- **src/**: Código fonte principal.
  - **controllers/**: Lógica de controle (CRUD).
    - `productController.js`: Lógica de produtos.
    - `orderController.js`: Lógica de pedidos.
    - `customerController.js`: Lógica de clientes.
  - **routes/**: Definição das rotas da API.
    - `index.js`: Roteador principal que agrupa todas as rotas.
    - `productRoutes.js`: Rotas específicas de produtos.
    - `orderRoutes.js`: Rotas específicas de pedidos.
    - `customerRoutes.js`: Rotas específicas de clientes.
  - **db.js**: Banco de dados em memória (simulação).
  - **app.js**: Configuração e inicialização do servidor Express.

## Instalação

1.  Instale as dependências:

    ```bash
    npm install
    ```

2.  Inicie o servidor:
    ```bash
    npm start
    ```
    O servidor rodará em `http://localhost:3000`.

## Endpoints

### Produtos

- `GET /api/product`: Lista todos os produtos.
- `GET /api/product/:id`: Busca um produto pelo ID.
- `POST /api/product`: Cria um novo produto (Body: `{ "name": "...", "value": 10.0 }`).
- `PUT /api/product/:id`: Atualiza um produto.
- `DELETE /api/product/:id`: Remove um produto.

### Pedidos

- `GET /api/order`: Lista todos os pedidos.
- `GET /api/order/:id`: Busca um pedido pelo ID.
- `POST /api/order`: Cria um novo pedido (Body: `{ "items": [{ "id": 1, "quantity": 2 }] }`).
- `PUT /api/order/:id`: Atualiza um pedido.
- `DELETE /api/order/:id`: Remove um pedido.

### Clientes

- `GET /api/customer`: Lista todos os clientes.
- `GET /api/customer/:id`: Busca um cliente pelo ID.
- `POST /api/customer`: Cria um novo cliente (Body: `{ "name": "...", "email": "..." }`).
- `PUT /api/customer/:id`: Atualiza um cliente.
- `DELETE /api/customer/:id`: Remove um cliente.

## Funcionalidades

- **Gerenciamento de Estado**: Utiliza um "banco de dados" em memória (`db.js`) compartilhado entre os controladores.
- **Validação Relacional**: Ao criar ou atualizar um pedido, o sistema verifica se os produtos informados realmente existem.
- **CORS Habilitado**: Configurado para aceitar requisições de qualquer origem, permitindo integração com frontends externos.
