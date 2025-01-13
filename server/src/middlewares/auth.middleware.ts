// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.cookies?.access_token;
        
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: '未登入'
            });
        }

        const { data, error } = await authService.verifySession(accessToken);
        
        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: error?.message || '無效的 session'
            });
        }

        req.user = data.user;
        
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: '請重新登入'
        });
    }
};