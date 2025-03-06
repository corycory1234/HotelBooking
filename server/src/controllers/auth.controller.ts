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
            res.json({
                success: true,
                data: {
                    user: {
                        id: result.user.id,
                        name: result.user.name,
                        userType: result.user.userType,
                        email: result.session.user.email,
                    },
                    tokens: {
                        access_token: result.session.access_token,
                        refresh_token: result.session.refresh_token,
                    },
                },
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },

    async logout(req: Request, res: Response) {
        try {
            const accessToken = req.headers.authorization?.split(" ")[1];
            if (!accessToken) {
                res.status(401).json({
                    success: false,
                    message: "無法存取或 Session 已過期",
                });
                return;
            }

            await authService.logout(accessToken);

            res.json({
                success: true,
                message: "登出成功",
            });
            return;
        } catch (error: any) {
            if (error.message === "Invalid token") {
                res.status(401).json({
                    success: false,
                    message: "無效的 Session",
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: "登出失敗，請稍後再試",
            });
            return;
        }
    },

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email);

            res.json({
                success: true,
                message: "重設密碼郵件已發送",
            });
            return;
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }
    },

    async getCurrentUser(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "未登入",
                });
                return;
            }

            const user = await authService.getCurrentUser(token);

            res.json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    userType: user.userType,
                    email: user.email,
                },
            });
            return;
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
            return;
        }
    },

    async verifySession(req: Request, res: Response) {
        try {
            const accessToken = req.headers.authorization?.split(" ")[1];
            if (!accessToken) {
                res.status(401).json({
                    success: false,
                    message: "未登入",
                });
                return;
            }

            const result = await authService.verifySession(accessToken);

            if (result.error) {
                res.status(401).json({
                    success: false,
                    message: result.error.message,
                });
                return;
            }

            res.json({
                success: true,
                data: result.data,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.headers.authorization?.split(" ")[1];

            if (!refreshToken) {
                res.status(401).json({
                    success: false,
                    message: "未登入",
                });
                return;
            }

            const result = await authService.refreshSession(refreshToken);

            res.json({
                success: true,
                data: {
                    tokens: {
                        access_token: result.access_token,
                        refresh_token: result.refresh_token,
                    },
                },
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: "請重新登入",
            });
        }
    },
};
