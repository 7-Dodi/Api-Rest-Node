
# Projeto de Estudo de API Simples em Node.js e TypeScript

Este é um projeto de exemplo para demonstrar como criar uma API simples em Node.js usando TypeScript. A API possui algumas rotas de teste e armazena dados em um array.

## Requisitos
Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
- [TypeScript](https://www.typescriptlang.org/)
- [Insomnia](https://insomnia.rest/download)

## Instalação
1. Clone este repositório:
https://github.com/7-Dodi/Api-Rest-Node.git

2. Navegue até o diretório do projeto:
cd Api-Rest-Node

3. Instale as dependências:
npm install

## Uso
1. Inicie o servidor:
npm run dev

2. A API estará disponível em: `http://localhost:5000`

## Rotas

- GET /users: Retorna todos os usuários armazenados.
- POST /users: Adiciona um novo usuário.
- GET /technologies: Retorna todas as tecnologias do usúario passado pelo o `heard` da aplicação.
- POST /technologies: Adiciona uma nova tecnologia ao usuário passado pelo o `heard` da aplicação.
- PUT technologies/:id: Atualiza o `title` e o `deadline` de uma tecnologia existente.
- PATCH technologies/:id/studied: Atualiza o atributo studied para `true`
- DELETE technologies/:id: Remove uma tecnologia existe de um usuário passado pelo `heard`da aplicação.
