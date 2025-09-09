import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env.local' });

const isProd =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
  process.env.NODE_ENV === 'production';

const DB_URL = isProd ? process.env.PRODUCTION_DB_URL! : process.env.DEVELOPMENT_DB_URL!;

export default defineConfig({
  schema: "./db/schemas/index.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: DB_URL,
  },
  verbose: true,
  strict: true,
});