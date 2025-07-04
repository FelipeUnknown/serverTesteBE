// src/server.ts

import express from 'express';
import { Pool } from 'pg'; // Importamos Pool explicitamente
import dotenv from 'dotenv'; // Para carregar variáveis de ambiente

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

// Configuração do pool de conexão com o banco de dados
const dbPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'), // Garante que a porta seja um número
});

// Opcional: Logs de conexão para depuração
dbPool.on('connect', () => {
  console.log('Cliente PostgreSQL conectado com sucesso!');
});

dbPool.on('error', (err) => {
  console.error('Erro inesperado no cliente PostgreSQL:', err.message, err.stack);
  // Em um ambiente de produção, você pode querer tentar reconectar ou ter um mecanismo de retry aqui.
  // Por enquanto, apenas logamos o erro.
});

const app = express();
const port = process.env.PORT || 3000; // Define a porta do servidor, pode vir do .env

// Middleware para parsing de JSON no corpo das requisições
app.use(express.json());



// Rotas Principais

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo ao meu servidor TypeScript com PostgreSQL!' });
});

// Rota de teste para verificar a conexão com o banco de dados
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await dbPool.query('SELECT NOW() AS current_time');
    res.status(200).json({
      message: 'Conexão com o PostgreSQL bem-sucedida!',
      currentTime: result.rows[0].current_time,
    });
  } catch (error: any) {
    console.error('Erro ao conectar ou consultar o banco de dados:', error.message);
    res.status(500).json({
      message: 'Erro na conexão ou consulta ao banco de dados.',
      error: error.message,
    });
  }
});


// Rotas de Configuração do Banco de Dados (Setup)

// Rota para criar a tabela 'users' e inserir dados de exemplo
app.get('/api/setup-users-table', async (req, res) => { // Renomeada para clareza
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await dbPool.query(`
      INSERT INTO users (name, email) VALUES
      ('Alice Smith', 'alice@example.com'),
      ('Bob Johnson', 'bob@example.com')
      ON CONFLICT (email) DO NOTHING; -- Não insere se o email já existe
    `);
    res.status(200).json({ message: 'Tabela "users" criada e dados de exemplo inseridos/atualizados.' });
  } catch (error: any) {
    console.error('Erro ao configurar a tabela de usuários:', error.message);
    res.status(500).json({
      message: 'Erro ao configurar o banco de dados para usuários.',
      error: error.message,
    });
  }
});

// Rota para criar a tabela 'products' e inserir dados fictícios
app.get('/api/setup-products-table', async (req, res) => {
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        category VARCHAR(50)
      );
    `);
    await dbPool.query(`
      INSERT INTO products (id, name, price, category) VALUES
      ('PROD001', 'Smartphone XYZ', 999.99, 'Electronics'),
      ('PROD002', 'Notebook Pro', 1499.00, 'Electronics'),
      ('PROD003', 'Mouse Sem Fio', 49.50, 'Accessories'),
      ('PROD004', 'Teclado Mecânico', 120.00, 'Accessories'),
      ('PROD005', 'Monitor UltraWide', 799.00, 'Electronics')
      ON CONFLICT (id) DO UPDATE SET -- Atualiza se o ID já existe
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        category = EXCLUDED.category;
    `);
    res.status(200).json({ message: 'Tabela "products" criada e dados fictícios inseridos/atualizados.' });
  } catch (error: any) {
    console.error('Erro ao configurar a tabela de produtos:', error.message);
    res.status(500).json({
      message: 'Erro ao configurar a tabela de produtos.',
      error: error.message,
    });
  }
});



// Rotas de Listagem de Dados

// Rota para listar usuários
app.get('/api/users', async (req, res) => {
  try {
    const result = await dbPool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error.message);
    res.status(500).json({
      message: 'Erro ao buscar usuários.',
      error: error.message,
    });
  }
});

// Rota para listar produtos
app.get('/api/products', async (req, res) => {
  try {
    const result = await dbPool.query('SELECT id, name, price, category FROM products ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error.message);
    res.status(500).json({
      message: 'Erro ao buscar produtos.',
      error: error.message,
    });
  }
});



// Inicialização do Servidor

// Inicia o servidor Express (chamado APENAS UMA VEZ!)
app.listen(port, () => {
  console.log(`Servidor TS rodando em http://localhost:${port}`);
});