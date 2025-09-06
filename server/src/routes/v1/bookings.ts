import express from 'express';
import { BookingController } from '../../controllers/booking.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// 建立新訂單
router.post('/', authMiddleware, BookingController.createBooking);

// 獲取當前用戶的所有訂單
router.get('/my-bookings', authMiddleware, BookingController.getUserBookings);

// 獲取特定飯店的所有訂單
router.get('/hotel/:hotelId', authMiddleware, BookingController.getHotelBookings);

// 獲取單一訂單詳細資訊
router.get('/:id', authMiddleware, BookingController.getBookingById);

// 更新訂單狀態
router.patch('/:id/status', authMiddleware, BookingController.updateBookingStatus);

export default router;