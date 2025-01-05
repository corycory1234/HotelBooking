import express from 'express';
import 'dotenv/config';
import { hotelController } from '../../controllers/hotel.controller';
import { authenticate } from '../../middlewares/auth';

const router = express.Router();

// 使用 async handler 包裝控制器方法
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 搜尋飯店列表
router.get('/', hotelController.getHotels);

// 獲取飯店詳情
router.get('/:id', asyncHandler(hotelController.getHotel));

// 獲取飯店房型
router.get('/:id/rooms', async (req, res) => {
  // TODO: 實作房型列表邏輯
});

// 需要認證的路由
// router.post('/', authenticate, hotelController.createHotel);

export default router;