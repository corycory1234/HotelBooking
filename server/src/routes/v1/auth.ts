import express from "express";
import "dotenv/config";
import { authController } from "../../controllers/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

// 使用 async handler 包裝控制器方法
const asyncHandler =
    (fn: Function) =>
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// 註冊
router.post("/register", asyncHandler(authController.register));

// 登入
router.post("/login", asyncHandler(authController.login));

// 登出
router.post("/logout", asyncHandler(authController.logout));

// 忘記密碼
router.post("/forgot-password", asyncHandler(authController.forgotPassword));

// 取得當前用戶資訊
router.get("/me", authMiddleware, asyncHandler(authController.getCurrentUser));

// 驗證 session
router.get("/verify-session", asyncHandler(authController.verifySession));

// 刷新 token
router.post("/refresh-token", asyncHandler(authController.refreshToken));

// Google 登入
router.post("/google-login", asyncHandler(authController.googleLogin));

export default router;
