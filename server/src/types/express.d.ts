import { User } from "@supabase/supabase-js";

export {};

declare global {
    namespace Express {
        interface Request {
            user?: Partial<User>;
        }
    }
}
