# API RESTful de Produtos e Pedidos

Este diretório contém uma API RESTful completa desenvolvida com **Node.js** e **Express**.

## Funcionalidades

- **Gerenciamento de Estado**: Utiliza um "banco de dados" em memória (`db.js`) compartilhado entre os controladores.
- **Validação Relacional**: Ao criar ou atualizar um pedido, o sistema verifica se os produtos informados realmente existem.
- **CORS Habilitado**: Configurado para aceitar requisições de qualquer origem, permitindo integração com frontends externos (como o da pasta `10`).

## Estrutura dos Arquivos

1.  `app.js`: Configura o servidor, middlewares (JSON, CORS) e rotas.
2.  `routes.js`: Define os endpoints e mapeia para os controladores.
3.  `db.js`: Armazena os dados em memória (arrays) durante a execução.
4.  `productController.js` e `orderController.js`: Lógica de negócio (CRUD).

## Endpoints Disponíveis

O servidor roda em `http://localhost:3000/api`.

### Produtos

| Método     | Rota           | Descrição                  |
| :--------- | :------------- | :------------------------- |
| **GET**    | `/product`     | Lista todos os produtos    |
| **GET**    | `/product/:id` | Busca produto por ID       |
| **POST**   | `/product`     | Cria novo produto          |
| **PUT**    | `/product/:id` | Atualiza produto existente |
| **DELETE** | `/product/:id` | Remove produto             |

### Pedidos

| Método     | Rota         | Descrição                          |
| :--------- | :----------- | :--------------------------------- |
| **GET**    | `/order`     | Lista todos os pedidos             |
| **GET**    | `/order/:id` | Busca pedido por ID                |
| **POST**   | `/order`     | Cria novo pedido (valida produtos) |
| **PUT**    | `/order/:id` | Atualiza pedido existente          |
| **DELETE** | `/order/:id` | Remove pedido                      |

## Como Executar

```bash
npm start
```
