import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// 資料庫相關設定
const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });