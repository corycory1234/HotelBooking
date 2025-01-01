import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schema';


if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// 創建 Supabase 客戶端
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// 創建 Postgres 連線
const queryClient = postgres(process.env.DATABASE_URL);

// 創建 Drizzle 實例
export const db = drizzle(queryClient, { schema });