import { User } from './user.types';

export {};

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
