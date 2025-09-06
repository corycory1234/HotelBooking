import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { User } from '../types/user.types';

// 改用 Express 的全域宣告
export class BookingController {
    static async createBooking(req: Request, res: Response) {
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

            const newBooking = await bookingService.createBooking(bookingData);
            res.status(201).json({
                status: 'success',
                data: newBooking
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static async getUserBookings(req: Request, res: Response) {
        try {
            if (!req.user) {
                throw new Error('未登入');
            }
            const bookings = await bookingService.getUserBookings(req.user.id);
            res.status(200).json({
                status: 'success',
                data: bookings
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static async getHotelBookings(req: Request, res: Response) {
        try {
            if (!req.user) {
                throw new Error('未登入');
            }
            const bookings = await bookingService.getHotelBookings(
                req.params.hotelId,
                req.user.id
            );
            res.status(200).json({
                status: 'success',
                data: bookings
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static async getBookingById(req: Request, res: Response) {
        try {
            if (!req.user) {
                throw new Error('未登入');
            }
            const booking = await bookingService.getBookingById(
                req.params.id,
                req.user.id
            );
            res.status(200).json({
                status: 'success',
                data: booking
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    static async updateBookingStatus(req: Request, res: Response) {
        try {
            if (!req.user) {
                throw new Error('未登入');
            }
            const booking = await bookingService.updateBookingStatus(
                req.params.id,
                req.body.status,
                req.user.id
            );
            res.status(200).json({
                status: 'success',
                data: booking
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
}
