# Sistema de Gestão de Pedidos (Fullstack)

Aplicação completa com Backend (Node.js/Express) e Frontend (HTML/CSS/JS), implementando segurança via JWT e controle de acesso (RBAC).

## 🚀 Funcionalidades

### Backend (API)

- **Autenticação Segura:** Login com JWT e Cookies HttpOnly.
- **Controle de Acesso (RBAC):**
  - **Admin:** Pode criar/editar/excluir usuários, produtos e pedidos.
  - **User:** Pode visualizar produtos, realizar pedidos e ver seu próprio perfil.
- **Documentação Automática:** Swagger UI disponível em `/api-docs`.
- **Gestão Completa:** CRUD de Produtos, Pedidos (+Busca), Clientes e Usuários.
- **Segurança Extra:** Configuração de CORS restrito, proteção contra XSS e Iframe.

### Frontend (Web)

- Integrado diretamente ao servidor (servido via `express.static`).
- Design moderno (Glassmorphism).
- Redirecionamento automático para Login se a sessão expirar (401/403).

---

## 📂 Estrutura do Projeto

- **server/**: Código do servidor.
  - `src/controllers`: Lógica de negócio.
  - `src/routes`: Definição de rotas e middleware de proteção (`permissionVerify.js`).
  - `src/db.js`: Banco de dados em memória.
- **web/**: Arquivos do frontend (HTML, CSS, JS).

---

## 🛠️ Instalação e Execução

1.  Acesse a pasta do servidor:
    ```bash
    cd server
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação:
    ```bash
    npm start
    ```
4.  Acesse no navegador:
    - **Aplicação:** [http://localhost:3000](http://localhost:3000)
    - **Documentação API:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🔐 Credenciais Padrão

| Usuário   | Senha | Tipo  | Permissões                                      |
| :-------- | :---- | :---- | :---------------------------------------------- |
| **admin** | 123   | Admin | Total (CRUD Usuários, Produtos, etc)            |
| **user**  | 123   | User  | Apenas leitura de produtos e criação de pedidos |

---

## 🔗 Endpoints Principais

### Autenticação

- `POST /api/login`: Realizar login.
- `GET /api/login`: Ver dados do usuário logado.

### Gestão (Exige Token)

- `GET /api/product`: Listar produtos.
- `GET /api/order/search`: Buscar pedidos (Filtros: `product_id`, `customer_id`).
- _(Ver lista completa no Swagger)_

---

## 📝 Notas de Desenvolvimento

- O projeto utiliza o padrão **MVC** simplificado.
- O Frontend é **Static**, mas consome a API via `fetch` interceptando erros de autenticação (401).
- Configurado para rodar na porta **3000**.
