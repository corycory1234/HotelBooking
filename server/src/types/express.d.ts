import { User } from "@supabase/supabase-js";

declare global {
    namespace Express {
        interface Request {
            user?: Partial<User>;
        }
    }
}
