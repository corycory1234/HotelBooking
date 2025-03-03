"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// 使用 async handler 包裝控制器方法
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// 註冊
router.post("/register", asyncHandler(auth_controller_1.authController.register));
// 登入
router.post("/login", asyncHandler(auth_controller_1.authController.login));
// 登出
router.post("/logout", asyncHandler(auth_controller_1.authController.logout));
// 忘記密碼
router.post("/forgot-password", asyncHandler(auth_controller_1.authController.forgotPassword));
// 取得當前用戶資訊
router.get("/me", auth_middleware_1.authMiddleware, asyncHandler(auth_controller_1.authController.getCurrentUser));
// 驗證 session
router.get("/verify-session", asyncHandler(auth_controller_1.authController.verifySession));
// 刷新 token
router.post("/refresh-token", asyncHandler(auth_controller_1.authController.refreshToken));
// Google 登入
router.post("/google", asyncHandler(auth_controller_1.authController.googleLogin));
exports.default = router;
