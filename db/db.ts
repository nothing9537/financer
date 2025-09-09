import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const isProd =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
  process.env.NODE_ENV === 'production';

const DB_URL = isProd ? process.env.PRODUCTION_DB_URL! : process.env.DEVELOPMENT_DB_URL!;

export const sql = neon(DB_URL);
export const db = drizzle(sql);