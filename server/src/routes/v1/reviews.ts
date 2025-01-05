import express from 'express';
const router = express.Router();

// 新增評價
router.post('/hotels/:hotelId', async (req, res) => {
  // TODO: 實作新增評價邏輯
});

// 獲取飯店評價列表
router.get('/hotels/:hotelId', async (req, res) => {
  // TODO: 實作評價列表邏輯
});

export default router;