import express from 'express';
const router = express.Router();

// 建立訂單
router.post('/', async (req, res) => {
  // TODO: 實作建立訂單邏輯
});

// 獲取訂單列表
router.get('/', async (req, res) => {
  // TODO: 實作訂單列表邏輯
});

// 獲取訂單詳情
router.get('/:id', async (req, res) => {
  // TODO: 實作訂單詳情邏輯
});

// 取消訂單
router.delete('/:id', async (req, res) => {
  // TODO: 實作取消訂單邏輯
});

export default router;