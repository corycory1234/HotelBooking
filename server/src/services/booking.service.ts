import { BaseService } from './base.service';
import { bookings } from '../db/schema/bookings';
import { hotels } from '../db/schema/hotels';
import { roomTypes } from '../db/schema/rooms';
import { eq, and, or, gte, lte, desc } from 'drizzle-orm';

interface CreateBookingData {
    userId: string;
    hotelId: string;
    roomId: string;
    travelerName: string;
    customerEmail: string;
    customerPhone?: string;
    checkInDate: Date;
    checkOutDate: Date;
    adults: number;
    children?: number;
    roomCount: number;
}

export class BookingService extends BaseService {
    private async validateBookingDates(checkInDate: Date, checkOutDate: Date) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (checkInDate < now) {
            throw new Error('入住日期不能早於今天');
        }

        if (checkInDate >= checkOutDate) {
            throw new Error('退房日期必須晚於入住日期');
        }

        const maxStayDays = 30; // 最大入住天數
        const daysDifference = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDifference > maxStayDays) {
            throw new Error(`入住時間不能超過 ${maxStayDays} 天`);
        }
    }

    private async checkRoomAvailability(roomId: string, checkInDate: Date, checkOutDate: Date, requestedCount: number) {
        const room = await this.db.query.roomTypes.findFirst({
            where: eq(roomTypes.id, roomId)
        });

        if (!room) {
            throw new Error('找不到指定房間');
        }

        const existingBookings = await this.db.query.bookings.findMany({
            where: and(
                eq(bookings.roomId, roomId),
                or(
                    and(
                        gte(bookings.checkInDate, checkInDate),
                        lte(bookings.checkInDate, checkOutDate)
                    ),
                    and(
                        gte(bookings.checkOutDate, checkInDate),
                        lte(bookings.checkOutDate, checkOutDate)
                    )
                )
            )
        });

        const totalBookedRooms = existingBookings.reduce(
            (sum, booking) => sum + booking.roomCount,
            0
        );

        if (totalBookedRooms + requestedCount > room.totalRooms) {
            throw new Error('所選日期區間房間數量不足');
        }

        return room;
    }

    // 建立訂單
    async createBooking(data: CreateBookingData) {
        try {
            // 驗證日期
            await this.validateBookingDates(data.checkInDate, data.checkOutDate);

            // 檢查房間可用性
            const room = await this.checkRoomAvailability(
                data.roomId,
                data.checkInDate,
                data.checkOutDate,
                data.roomCount
            );

            // 獲取飯店資訊
            const hotel = await this.db.query.hotels.findFirst({
                where: eq(hotels.id, data.hotelId)
            });

            if (!hotel) {
                throw new Error('找不到指定飯店');
            }

            // 計算價格
            const nights = Math.ceil(
                (data.checkOutDate.getTime() - data.checkInDate.getTime()) / 
                (1000 * 60 * 60 * 24)
            );

            const subtotal = room.price * data.roomCount * nights;
            const tax = hotel.tax || 0;
            const totalPrice = subtotal * (1 + tax);

            // 建立訂單
            const [newBooking] = await this.db.insert(bookings)
                .values({
                    ...data,
                    price: room.price,
                    tax,
                    totalPrice,
                    checkinTime: hotel.checkin,
                    checkoutTime: hotel.checkout,
                    status: 'pending',
                    paymentStatus: 'pending',
                    address: hotel.address,
                    city: hotel.city,
                    country: hotel.country,
                    latitude: hotel.latitude,
                    longitude: hotel.longitude,
                    facilities: hotel.facilityList
                })
                .returning();

            return newBooking;
        } catch (error: any) {
            throw new Error(error.message || '建立訂單失敗');
        }
    }

    // 獲取用戶訂單列表
    async getUserBookings(userId: string) {
        try {
            return await this.db.query.bookings.findMany({
                where: eq(bookings.userId, userId),
                orderBy: [desc(bookings.createdAt)]
            });
        } catch (error) {
            throw new Error('獲取訂單列表失敗');
        }
    }

    // 獲取飯店訂單列表
    async getHotelBookings(hotelId: string, userId: string) {
        try {
            // 驗證使用者是否為飯店擁有者
            const hotel = await this.db.query.hotels.findFirst({
                where: and(
                    eq(hotels.id, hotelId),
                    eq(hotels.ownerId, userId)
                )
            });

            if (!hotel) {
                throw new Error('未授權的操作');
            }

            return await this.db.query.bookings.findMany({
                where: eq(bookings.hotelId, hotelId),
                orderBy: [desc(bookings.createdAt)]
            });
        } catch (error) {
            throw new Error('獲取訂單列表失敗');
        }
    }

    // 獲取單一訂單詳情
    async getBookingById(bookingId: string, userId: string) {
        try {
            const booking = await this.db.query.bookings.findFirst({
                where: eq(bookings.id, bookingId)
            });

            if (!booking) {
                throw new Error('訂單不存在');
            }

            // 檢查權限
            const hotel = await this.db.query.hotels.findFirst({
                where: eq(hotels.id, booking.hotelId)
            });

            if (booking.userId !== userId && hotel?.ownerId !== userId) {
                throw new Error('未授權的操作');
            }

            return booking;
        } catch (error) {
            throw new Error('獲取訂單詳情失敗');
        }
    }

    // 更新訂單狀態
    async updateBookingStatus(bookingId: string, status: string, userId: string) {
        try {
            const booking = await this.getBookingById(bookingId, userId);
            
            const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
            if (!validStatuses.includes(status)) {
                throw new Error('無效的訂單狀態');
            }

            const [updatedBooking] = await this.db
                .update(bookings)
                .set({ 
                    status,
                    updatedAt: new Date()
                })
                .where(eq(bookings.id, bookingId))
                .returning();

            return updatedBooking;
        } catch (error) {
            throw new Error('更新訂單狀態失敗');
        }
    }
}

export const bookingService = new BookingService();
