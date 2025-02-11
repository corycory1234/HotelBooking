"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../../controllers/booking.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// 建立新訂單
router.post('/', auth_middleware_1.authMiddleware, booking_controller_1.BookingController.createBooking);
// 獲取當前用戶的所有訂單
router.get('/my-bookings', auth_middleware_1.authMiddleware, booking_controller_1.BookingController.getUserBookings);
// 獲取特定飯店的所有訂單
router.get('/hotel/:hotelId', auth_middleware_1.authMiddleware, booking_controller_1.BookingController.getHotelBookings);
// 獲取單一訂單詳細資訊
router.get('/:id', auth_middleware_1.authMiddleware, booking_controller_1.BookingController.getBookingById);
// 更新訂單狀態
router.patch('/:id/status', auth_middleware_1.authMiddleware, booking_controller_1.BookingController.updateBookingStatus);
exports.default = router;
