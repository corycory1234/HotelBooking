"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// 註冊
router.post('/register', auth_controller_1.authController.register);
// 登入
router.post('/login', auth_controller_1.authController.login);
// 登出
router.post('/logout', auth_controller_1.authController.logout);
// 忘記密碼
router.post('/forgot-password', auth_controller_1.authController.forgotPassword);
// 取得當前用戶資訊
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.authController.getCurrentUser);
// Google 登入
router.post('/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: 實作 Google 登入邏輯
}));
exports.default = router;
