import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const clienteBaseDeDatos = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pos_db',
    port: process.env.DB_PORT || 3306,
  },
  pool: { min: 0, max: 10 },
});

export default clienteBaseDeDatos;