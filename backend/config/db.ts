import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  host: String(process.env.DB_HOST || 'localhost'),
  port: Number(process.env.DB_PORT || 5432),
  database: String(process.env.DB_NAME || 'TCG'),
  user: String(process.env.DB_USER || 'postgres'),
  password: String(process.env.DB_PASSWORD ?? ''),
});

export default pool;
