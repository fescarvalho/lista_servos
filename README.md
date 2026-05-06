# Sistema de Coleta de Dados

Esta é uma aplicação web moderna construída com Next.js, React, TypeScript, TailwindCSS e Prisma para coleta de dados de um grupo de pessoas.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js (App Router), React, TailwindCSS, Framer Motion
- **Backend**: Next.js Route Handlers
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL (recomendado Supabase)
- **Validação**: Zod
- **Notificações**: React Hot Toast

## 🛠️ Como Rodar o Projeto

### 1. Clonar e Instalar Dependências

Se você já tem o código, basta instalar os pacotes:

```bash
npm install
```

### 2. Configurar o Banco de Dados

Crie um arquivo `.env` na raiz do projeto (se não existir) e adicione sua string de conexão PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
```

### 3. Configurar o Prisma

Gere o cliente do Prisma e sincronize o banco de dados:

```bash
npx prisma generate
npx prisma db push
```

### 4. Rodar o Ambiente de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📌 Requisitos Atendidos

- [x] Formulário centralizado e responsivo
- [x] Campos Nome e Data de Nascimento (obrigatórios)
- [x] Validação no Frontend e Backend (Zod)
- [x] Feedback de loading e sucesso/erro
- [x] Persistência no PostgreSQL usando Prisma
- [x] Arquitetura organizada e escalável
