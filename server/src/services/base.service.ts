import { db, supabase } from "../db";

export abstract class BaseService {
    protected db = db;
    protected supabase = supabase;
}
