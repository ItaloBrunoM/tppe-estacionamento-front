# Frontend - Gerenciamento de Estacionamento

Este é o repositório para o frontend da aplicação de gerenciamento de estacionamentos. Construído com React, Vite e TypeScript, este projeto oferece uma interface de usuário para interagir com o sistema de estacionamento.

## ⚙️ Tecnologias Utilizadas

- **React:** Biblioteca para construção de interfaces de usuário.
- **Vite:** Ferramenta de build para frontend moderna e rápida.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **React Router:** Para roteamento de páginas.
- **Axios:** Cliente HTTP para realizar requisições à API.
- **Cypress:** Para testes end-to-end.
- **ESLint:** Para linting de código e padronização.

## ✨ Funcionalidades

- Visualização de estacionamentos.
- Criação, edição e exclusão de estacionamentos.
- Interface com sidebar e topbar para navegação.
- Busca de estacionamentos.
- Modais de confirmação para ações destrutivas.

## 🚀 Começando

Siga estas instruções para ter o projeto rodando localmente para desenvolvimento e testes.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/italobrunom/tppe-estacionamento-front.git
```

2. Navegue até o diretório do projeto:

```bash
cd tppe-estacionamento-front
```

3. Instale as dependências:

```bash
npm install
```

### Rodando a Aplicação

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## ✅ Testando com Cypress

O projeto utiliza o Cypress para testes end-to-end.

### Como rodar os testes

Existem duas formas de executar os testes:

1. **Em modo interativo (com interface gráfica):**

Este comando abrirá o Cypress Test Runner, onde você pode ver os testes rodando em um navegador e interagir com eles.

```bash
npm run cy:open
```

2. **Em modo headless (sem interface gráfica):**

Este comando executará todos os testes em um terminal, sem abrir a interface do navegador. É ideal para integração contínua (CI).

```bash
npm run test:e2e
```
