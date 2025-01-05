import { Request, Response, NextFunction } from "express";
import { supabase } from "../db";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("No token provided");
        }

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new Error("Invalid token");
        }

        // 將用戶信息添加到 request 對象
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }
};
