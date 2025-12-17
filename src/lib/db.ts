import { Pool, PoolConfig } from 'pg';

type GlobalWithPool = typeof globalThis & {
  __shaily_pg_pool__?: Pool;
};

const resolveConnectionString = () => {
  return (
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL_NO_SSL ||
    process.env.DATABASE_URL ||
    ''
  );
};

const createPool = () => {
  const connectionString = resolveConnectionString();
  const config: PoolConfig = {
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionString: connectionString || undefined,
  };

  if (!connectionString) {
    config.user = process.env.PGUSER || 'postgres';
    config.host =
      process.env.POSTGRES_HOST ||
      process.env.PGHOST ||
      'localhost';
    config.database = process.env.PGDATABASE || 'postgres';
    config.password = process.env.PGPASSWORD || 'postgres';
    config.port = process.env.PGPORT ? Number(process.env.PGPORT) : 5432;
  }

  const sslDisabled =
    connectionString?.includes('sslmode=disable') ||
    connectionString === process.env.POSTGRES_URL_NO_SSL;

  const shouldUseSSL =
    !sslDisabled &&
    (process.env.POSTGRES_SSL === 'true' ||
      process.env.NODE_ENV === 'production' ||
      Boolean(process.env.NEON_PROJECT_ID) ||
      /neon\.tech/i.test(connectionString || '') ||
      /neon\.tech/i.test(
        process.env.POSTGRES_HOST || process.env.PGHOST || ''
      ));

  if (shouldUseSSL) {
    config.ssl = {
      rejectUnauthorized: false,
    };
  }

  return new Pool(config);
};

const globalWithPool = globalThis as GlobalWithPool;

const pool = globalWithPool.__shaily_pg_pool__ ?? createPool();
if (!globalWithPool.__shaily_pg_pool__) {
  globalWithPool.__shaily_pg_pool__ = pool;
}

export const query = <T>(text: string, params?: any[]) => pool.query<T>(text, params);

export default pool;
