import express from 'express';
import 'dotenv/config';
import { hotelController } from '../../controllers/hotel.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import multer from 'multer';

const router = express.Router();

// 使用 async handler 包裝控制器方法
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 限制 5MB
    },
});

// 搜尋飯店列表 (每頁固定回傳 10 筆)
// GET /?page=1&country=台灣&city=台北&minPrice=1000&maxPrice=5000&rating=4&q=關鍵字&facilities=pool,wifi&bedTypes=單人床,雙人床
router.get('/', asyncHandler(hotelController.getHotels));

// 獲取飯店詳情
router.get('/:id', asyncHandler(hotelController.getHotel));

// 獲取飯店房型
// router.get('/:id/rooms', async (req, res) => {
//   // TODO: 實作房型列表邏輯
// });

// 新增飯店
router.post('/', authMiddleware, asyncHandler(hotelController.createHotel));

// 上傳房型照片
router.post(
    '/room-types/:roomTypeId/images',
    authMiddleware,
    upload.array('images', 5), // 最多一次上傳 5 張
    asyncHandler(hotelController.uploadRoomTypeImages)
);

// 上傳飯店照片
router.post(
    '/:hotelId/images',
    authMiddleware,
    upload.array('images', 5), // 最多一次上傳 5 張
    asyncHandler(hotelController.uploadHotelImages)
);

// 刪除飯店照片
router.delete(
    '/:hotelId/images',
    authMiddleware,
    asyncHandler(hotelController.deleteHotelImages)
);

// 刪除房型照片
router.delete(
    '/room-types/:roomTypeId/images',
    authMiddleware,
    asyncHandler(hotelController.deleteRoomTypeImages)
);

export default router;