import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined.');
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const p = getDbPool();
  return p.query(text, params);
}
