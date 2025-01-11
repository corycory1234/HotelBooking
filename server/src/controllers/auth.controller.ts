import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
    async register(req: Request, res: Response) {
        try {
            const { email, password, name, userType } = req.body;
            const result = await authService.register({
                email,
                password,
                name,
                userType,
            });

            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);

            // 設置 cookies
            if (result.session) {
                res.cookie("access_token", result.session.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            }

            res.json({
                success: true,
                data: {
                    user: {
                        id: result.user.id,
                        name: result.user.name,
                        userType: result.user.userType,
                        email: result.session.user.email
                    }
                },
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
};
