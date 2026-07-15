import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbName = process.env.DB_NAME || 'tcg';
const dbConfig = {
  host: String(process.env.DB_HOST || 'localhost'),
  port: Number(process.env.DB_PORT || 5432),
  user: String(process.env.DB_USER || 'postgres'),
  password: String(process.env.DB_PASSWORD ?? ''),
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

function removeCreateDatabaseStatement(sql: string) {
  return sql.replace(/^\s*CREATE\s+DATABASE\s+\w+\s*;?\s*/i, '');
}

async function ensureDatabaseExists() {
  const adminPool = new Pool({ ...dbConfig, database: 'postgres' });

  try {
    const check = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (check.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Base ${dbName} creee.`);
    } else {
      console.log(`Base ${dbName} deja existante.`);
    }
  } finally {
    await adminPool.end();
  }
}

async function applySchema(sql: string) {
  const appPool = new Pool({ ...dbConfig, database: dbName });

  try {
    await appPool.query(sql);
    console.log('Schema SQL applique avec succes.');
  } finally {
    await appPool.end();
  }
}

async function initializeDatabase() {
  const sqlFilePath = path.resolve(__dirname, './config/db.sql');
  const rawSql = fs.readFileSync(sqlFilePath, 'utf8');
  const schemaSql = removeCreateDatabaseStatement(rawSql);

  try {
    await ensureDatabaseExists();
    await applySchema(schemaSql);
  } catch (error: unknown) {
    console.error("Erreur pendant l'initialisation SQL:");
    console.error(getErrorMessage(error));
    process.exitCode = 1;
  }
}

initializeDatabase();

export {};
