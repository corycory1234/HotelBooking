import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { db } from '../db';

export abstract class BaseService {
    protected readonly supabase: SupabaseClient = supabase;
    protected readonly db = db;
}
