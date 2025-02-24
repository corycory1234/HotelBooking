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
exports.bookingService = exports.BookingService = void 0;
const base_service_1 = require("./base.service");
const bookings_1 = require("../db/schema/bookings");
const hotels_1 = require("../db/schema/hotels");
const rooms_1 = require("../db/schema/rooms");
const drizzle_orm_1 = require("drizzle-orm");
class BookingService extends base_service_1.BaseService {
    validateBookingDates(checkInDate, checkOutDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (checkInDate < now) {
                throw new Error("入住日期不能早於今天");
            }
            if (checkInDate >= checkOutDate) {
                throw new Error("退房日期必須晚於入住日期");
            }
            const maxStayDays = 30; // 最大入住天數
            const daysDifference = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) /
                (1000 * 60 * 60 * 24));
            if (daysDifference > maxStayDays) {
                throw new Error(`入住時間不能超過 ${maxStayDays} 天`);
            }
        });
    }
    checkRoomAvailability(roomId, checkInDate, checkOutDate, requestedCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.db.query.roomTypes.findFirst({
                where: (0, drizzle_orm_1.eq)(rooms_1.roomTypes.roomType_Id, roomId),
            });
            if (!room) {
                throw new Error("找不到指定房間");
            }
            // 使用 roomAvailability 替代 totalRooms
            const availableRooms = room.room_Availability;
            const checkInStr = checkInDate.toISOString().split("T")[0];
            const checkOutStr = checkOutDate.toISOString().split("T")[0];
            const existingBookings = yield this.db.query.bookings.findMany({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_1.bookings.roomId, roomId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(bookings_1.bookings.checkInDate, checkInStr), (0, drizzle_orm_1.lte)(bookings_1.bookings.checkInDate, checkOutStr)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(bookings_1.bookings.checkOutDate, checkInStr), (0, drizzle_orm_1.lte)(bookings_1.bookings.checkOutDate, checkOutStr)))),
            });
            const totalBookedRooms = existingBookings.reduce((sum, booking) => sum + booking.roomCount, 0);
            if (totalBookedRooms + requestedCount > availableRooms) {
                throw new Error("所選日期區間房間數量不足");
            }
            return room;
        });
    }
    // 建立訂單
    createBooking(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // 驗證日期
                yield this.validateBookingDates(data.checkInDate, data.checkOutDate);
                // 檢查房間可用性
                const room = yield this.checkRoomAvailability(data.roomId, data.checkInDate, data.checkOutDate, data.roomCount);
                // 獲取飯店資訊
                const hotel = yield this.db.query.hotels.findFirst({
                    where: (0, drizzle_orm_1.eq)(hotels_1.hotels.hotel_Id, data.hotelId),
                });
                if (!hotel) {
                    throw new Error("找不到指定飯店");
                }
                // 取得飯店的第一張照片的 URL
                const hotelImage = hotel.hotel_Image_List && hotel.hotel_Image_List.length > 0
                    ? hotel.hotel_Image_List[0].url
                    : null;
                // 計算價格
                const nights = Math.ceil((data.checkOutDate.getTime() - data.checkInDate.getTime()) /
                    (1000 * 60 * 60 * 24));
                const roomPrice = parseFloat(room.room_Price);
                const subtotal = roomPrice * data.roomCount * nights;
                const taxRate = ((_a = hotel.tax) === null || _a === void 0 ? void 0 : _a.toString())
                    ? parseFloat(hotel.tax.toString())
                    : 0;
                const totalPrice = subtotal * (1 + taxRate);
                // 轉換日期為 ISO 日期字符串
                const checkInStr = data.checkInDate.toISOString().split("T")[0];
                const checkOutStr = data.checkOutDate.toISOString().split("T")[0];
                // 建立訂單
                const [newBooking] = yield this.db
                    .insert(bookings_1.bookings)
                    .values({
                    userId: data.userId,
                    hotelId: data.hotelId,
                    roomId: data.roomId,
                    bookingImage: hotelImage,
                    travelerName: data.travelerName,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    checkInDate: checkInStr,
                    checkOutDate: checkOutStr,
                    adults: data.adults,
                    children: data.children || 0,
                    roomCount: data.roomCount,
                    price: roomPrice.toString(),
                    tax: taxRate.toString(),
                    totalPrice: totalPrice.toString(),
                    status: "pending",
                    paymentStatus: "pending",
                    checkinTime: hotel.checkin,
                    checkoutTime: hotel.checkout,
                    address: hotel.address,
                    city: hotel.city,
                    country: hotel.country,
                    latitude: hotel.latitude,
                    longitude: hotel.longitude,
                    facilities: hotel.facility_List,
                })
                    .returning();
                return newBooking;
            }
            catch (error) {
                throw new Error(error.message || "建立訂單失敗");
            }
        });
    }
    // 獲取用戶訂單列表
    getUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.db
                    .select({
                    booking: bookings_1.bookings,
                    roomType: rooms_1.roomTypes,
                })
                    .from(bookings_1.bookings)
                    .leftJoin(rooms_1.roomTypes, (0, drizzle_orm_1.eq)(bookings_1.bookings.roomId, rooms_1.roomTypes.roomType_Id))
                    .where((0, drizzle_orm_1.eq)(bookings_1.bookings.userId, userId))
                    .orderBy((0, drizzle_orm_1.desc)(bookings_1.bookings.createdAt));
                return results.map(({ booking, roomType }) => (Object.assign(Object.assign({}, booking), { roomTypes: roomType })));
            }
            catch (error) {
                console.error("獲取訂單列表失敗:", error);
                throw new Error("獲取訂單列表失敗");
            }
        });
    }
    // 獲取飯店訂單列表
    getHotelBookings(hotelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 驗證使用者是否為飯店擁有者
                const hotel = yield this.db.query.hotels.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(hotels_1.hotels.hotel_Id, hotelId), (0, drizzle_orm_1.eq)(hotels_1.hotels.owner_Id, userId)),
                });
                if (!hotel) {
                    throw new Error("未授權的操作");
                }
                return yield this.db.query.bookings.findMany({
                    where: (0, drizzle_orm_1.eq)(bookings_1.bookings.hotelId, hotelId),
                    orderBy: [(0, drizzle_orm_1.desc)(bookings_1.bookings.createdAt)],
                });
            }
            catch (error) {
                throw new Error("獲取訂單列表失敗");
            }
        });
    }
    // 獲取單一訂單詳情
    getBookingById(bookingId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db
                    .select({
                    booking: bookings_1.bookings,
                    roomType: rooms_1.roomTypes,
                })
                    .from(bookings_1.bookings)
                    .leftJoin(rooms_1.roomTypes, (0, drizzle_orm_1.eq)(bookings_1.bookings.roomId, rooms_1.roomTypes.roomType_Id))
                    .where((0, drizzle_orm_1.eq)(bookings_1.bookings.id, bookingId))
                    .limit(1);
                if (!result[0]) {
                    throw new Error("訂單不存在");
                }
                const { booking, roomType } = result[0];
                // 檢查權限
                const hotel = yield this.db.query.hotels.findFirst({
                    where: (0, drizzle_orm_1.eq)(hotels_1.hotels.hotel_Id, booking.hotelId),
                });
                if (booking.userId !== userId && (hotel === null || hotel === void 0 ? void 0 : hotel.owner_Id) !== userId) {
                    throw new Error("未授權的操作");
                }
                return Object.assign(Object.assign({}, booking), { roomTypes: roomType });
            }
            catch (error) {
                throw new Error("獲取訂單詳情失敗");
            }
        });
    }
    // 更新訂單狀態
    updateBookingStatus(bookingId, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield this.getBookingById(bookingId, userId);
                const validStatuses = [
                    "pending",
                    "confirmed",
                    "cancelled",
                    "completed",
                ];
                if (!validStatuses.includes(status)) {
                    throw new Error("無效的訂單狀態");
                }
                const [updatedBooking] = yield this.db
                    .update(bookings_1.bookings)
                    .set({
                    status,
                    updatedAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(bookings_1.bookings.id, bookingId))
                    .returning();
                return updatedBooking;
            }
            catch (error) {
                throw new Error("更新訂單狀態失敗");
            }
        });
    }
}
exports.BookingService = BookingService;
exports.bookingService = new BookingService();
