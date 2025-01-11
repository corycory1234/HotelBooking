import express from 'express';
import 'dotenv/config';
import { authController } from '../../controllers/auth.controller';

const router = express.Router();

// 註冊
router.post('/register', authController.register);

// 登入
router.post('/login', authController.login);

// 登出
router.post('/logout', authController.logout);


// Google 登入
router.post('/google', async (req, res) => {
  // TODO: 實作 Google 登入邏輯
});

export default router;