import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    const supabase_Url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabase_Anon_Key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabase_Url || !supabase_Anon_Key) {
      throw new Error('Supabase configuration is missing. Please check your environment variables.');
    }

    supabaseInstance = createClient(supabase_Url, supabase_Anon_Key);
  }
  
  return supabaseInstance;
};

// 為了向後兼容，保留 supabase 導出但使用 getter
export const supabase = {
  get auth() {
    return getSupabaseClient().auth;
  }
};