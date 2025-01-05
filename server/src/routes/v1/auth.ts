import express from 'express';
import { authController } from '../../controllers/auth.controller';

const router = express.Router();

// 註冊
router.post('/register', authController.register);

// 登入
router.post('/login', authController.login);

// Google 登入
router.post('/google', async (req, res) => {
  // TODO: 實作 Google 登入邏輯
});

export default router;