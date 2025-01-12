// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.cookies.access_token;
        
        if (!accessToken) {
            throw new Error('未登入');
        }

        const user = await authService.verifySession(accessToken);
        req.user = user;
        
        next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: '請重新登入'
        });
    }
};