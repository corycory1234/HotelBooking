"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const booking_service_1 = require("../services/booking.service");
// 改用 Express 的全域宣告
class BookingController {
    static createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        status: 'error',
                        message: '未登入'
                    });
                    return;
                }
                const bookingData = {
                    userId: req.user.id,
                    hotelId: req.body.hotelId,
                    roomId: req.body.roomId,
                    travelerName: req.body.travelerName,
                    customerEmail: req.body.customerEmail,
                    customerPhone: req.body.customerPhone,
                    checkInDate: new Date(req.body.checkInDate),
                    checkOutDate: new Date(req.body.checkOutDate),
                    adults: parseInt(req.body.adults),
                    children: parseInt(req.body.children) || 0,
                    roomCount: parseInt(req.body.roomCount)
                };
                const newBooking = yield booking_service_1.bookingService.createBooking(bookingData);
                res.status(201).json({
                    status: 'success',
                    data: newBooking
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    static getUserBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    throw new Error('未登入');
                }
                const bookings = yield booking_service_1.bookingService.getUserBookings(req.user.id);
                res.status(200).json({
                    status: 'success',
                    data: bookings
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    static getHotelBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    throw new Error('未登入');
                }
                const bookings = yield booking_service_1.bookingService.getHotelBookings(req.params.hotelId, req.user.id);
                res.status(200).json({
                    status: 'success',
                    data: bookings
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    static getBookingById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    throw new Error('未登入');
                }
                const booking = yield booking_service_1.bookingService.getBookingById(req.params.id, req.user.id);
                res.status(200).json({
                    status: 'success',
                    data: booking
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    static updateBookingStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    throw new Error('未登入');
                }
                const booking = yield booking_service_1.bookingService.updateBookingStatus(req.params.id, req.body.status, req.user.id);
                res.status(200).json({
                    status: 'success',
                    data: booking
                });
            }
            catch (error) {
                res.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
}
exports.BookingController = BookingController;
