import { createClient } from '@supabase/supabase-js';

const supabase_Url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabase_Anon_Key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabase_Url, supabase_Anon_Key);