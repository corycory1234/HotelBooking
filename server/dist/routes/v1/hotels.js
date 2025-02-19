"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const hotel_controller_1 = require("../../controllers/hotel.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// 使用 async handler 包裝控制器方法
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 限制 5MB
    },
});
// 搜尋飯店列表 (每頁固定回傳 10 筆)
// GET /?page=1&country=台灣&city=台北&minPrice=1000&maxPrice=5000&ratings=4,5&q=關鍵字&facilities=pool,wifi&bedTypes=單人床,雙人床
router.get('/', asyncHandler(hotel_controller_1.hotelController.getHotels));
// 獲取飯店詳情
router.get('/:id', asyncHandler(hotel_controller_1.hotelController.getHotel));
// 獲取飯店房型
// router.get('/:id/rooms', async (req, res) => {
//   // TODO: 實作房型列表邏輯
// });
// 新增飯店
router.post('/', auth_middleware_1.authMiddleware, asyncHandler(hotel_controller_1.hotelController.createHotel));
// 上傳房型照片
router.post('/room-types/:roomTypeId/images', auth_middleware_1.authMiddleware, upload.array('images', 10), asyncHandler(hotel_controller_1.hotelController.uploadRoomTypeImages));
// 上傳飯店照片
router.post('/:hotelId/images', auth_middleware_1.authMiddleware, upload.array('images', 10), asyncHandler(hotel_controller_1.hotelController.uploadHotelImages));
// 刪除飯店照片
router.delete('/:hotelId/images', auth_middleware_1.authMiddleware, asyncHandler(hotel_controller_1.hotelController.deleteHotelImages));
// 刪除房型照片
router.delete('/room-types/:roomTypeId/images', auth_middleware_1.authMiddleware, asyncHandler(hotel_controller_1.hotelController.deleteRoomTypeImages));
// 刪除房型
router.delete('/room-types/:roomTypeId', auth_middleware_1.authMiddleware, asyncHandler(hotel_controller_1.hotelController.deleteRoomType));
exports.default = router;
