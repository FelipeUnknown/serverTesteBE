// src/config/db.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'), // Converte a porta para número
});

// Opcional: Loga eventos de conexão para depuração
pool.on('connect', () => {
  console.log('Cliente PostgreSQL conectado com sucesso!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente PostgreSQL:', err.message, err.stack);
  // Opcional: Você pode querer encerrar o processo aqui se o erro for crítico
  // process.exit(1);
});

export default pool;