// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { User, UserType } from "../types/user.types";

// 修改 Request 擴展方式
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "未提供認證令牌" });
            return;
        }

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            res.status(403).json({ message: "無效的認證令牌" });
            return;
        }

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.id),
        });

        if (!dbUser) {
            res.status(403).json({ message: "用戶不存在" });
            return;
        }

        // 設置完整的用戶資訊
        req.user = {
            id: dbUser.id,
            name: dbUser.name,
            email: user.email ?? undefined,
            userType: dbUser.userType as UserType,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
        };

        next();
    } catch (error: any) {
        res.status(401).json({ message: "驗證失敗" });
    }
};
