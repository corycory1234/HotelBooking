import { createClient } from '@supabase/supabase-js';

const supabase_Url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase_Anon_Key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabase_Url) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}

if (!supabase_Anon_Key) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
}

export const supabase = createClient(supabase_Url, supabase_Anon_Key);