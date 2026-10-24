import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        '[DB] DATABASE_URL is not defined. Set it in .env (e.g. postgresql://user:pass@host:5432/db)'
      );
    }
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err: Error) => {
      console.error('[DB] Unexpected PostgreSQL pool error:', err.message);
    });
  }
  return pool;
}

export async function getDb(): Promise<Pool> {
  return getPool();
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Converts SQLite-style `?` placeholders to PostgreSQL-style `$1, $2, $3...`
 * so all existing router code keeps working unchanged.
 */
function parametrize(sql: string): string {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const pgPool = getPool();
  const pgSql = parametrize(sql);
  const result: QueryResult = await pgPool.query(pgSql, params);
  return result.rows as unknown as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<void> {
  const pgPool = getPool();
  try {
    const pgSql = parametrize(sql);
    await pgPool.query(pgSql, params);
  } catch (err: any) {
    console.error('[DB EXECUTE ERROR] SQL:', sql.slice(0, 120), 'ERROR:', err.message);
    throw err;
  }
}

export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pgPool = getPool();
  const client: PoolClient = await pgPool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err: any) {
    console.error('[DB TRANSACTION ERROR]', err.message);
    try {
      await client.query('ROLLBACK');
    } catch {
      // Ignore if already rolled back
    }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Run raw SQL (e.g. schema migrations) directly against the pool.
 * Useful for bootstrapping the database on first start.
 */
export async function exec(sql: string): Promise<void> {
  const pgPool = getPool();
  await pgPool.query(sql);
}
