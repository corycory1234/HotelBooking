// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { User } from "@supabase/supabase-js";
import { authService } from "../services/auth.service";

interface AuthenticatedRequest extends Request {
    user?: Partial<User>;
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accessToken = req.cookies?.access_token;

        if (!accessToken) {
            res.status(401).json({
                success: false,
                message: "未登入",
            });
            return;
        }

        const { data, error } = await authService.verifySession(accessToken);

        if (error || !data.user) {
            res.status(401).json({
                success: false,
                message: error?.message || "無效的 session",
            });
            return;
        }

        req.user = data.user;

        next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: "請重新登入",
        });
        return;
    }
};
