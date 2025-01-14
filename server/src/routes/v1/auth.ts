import express from 'express';
import 'dotenv/config';
import { authController } from '../../controllers/auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// 註冊
router.post('/register', authController.register);

// 登入
router.post('/login', authController.login);

// 登出
router.post('/logout', authController.logout);

// 忘記密碼
router.post('/forgot-password', authController.forgotPassword);

// 取得當前用戶資訊
router.get('/me', authMiddleware, authController.getCurrentUser);



// Google 登入
router.post('/google', async (req, res) => {
  // TODO: 實作 Google 登入邏輯
});

export default router;