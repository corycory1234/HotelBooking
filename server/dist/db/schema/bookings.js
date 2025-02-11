"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const rooms_1 = require("./rooms");
const users_1 = require("./users");
const hotels_1 = require("./hotels");
exports.bookings = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.users.id, {
        onDelete: "cascade",
    }).notNull(),
    hotelId: (0, pg_core_1.uuid)("hotel_id").references(() => hotels_1.hotels.id, {
        onDelete: "cascade",
    }).notNull(),
    roomId: (0, pg_core_1.uuid)("room_id").references(() => rooms_1.roomTypes.id, {
        onDelete: "cascade",
    }).notNull(),
    bookingImage: (0, pg_core_1.varchar)("booking_image", { length: 255 }),
    travelerName: (0, pg_core_1.varchar)("traveler_name", { length: 255 }).notNull(),
    customerEmail: (0, pg_core_1.varchar)("customer_email", { length: 255 }).notNull(),
    customerPhone: (0, pg_core_1.varchar)("customer_phone", { length: 20 }),
    checkInDate: (0, pg_core_1.date)("check_in_date").notNull(),
    checkOutDate: (0, pg_core_1.date)("check_out_date").notNull(),
    checkinTime: (0, pg_core_1.varchar)("checkin_time", { length: 10 }).notNull(),
    checkoutTime: (0, pg_core_1.varchar)("checkout_time", { length: 10 }).notNull(),
    adults: (0, pg_core_1.integer)("adults").notNull(),
    children: (0, pg_core_1.integer)("children").default(0),
    roomCount: (0, pg_core_1.integer)("room_count").notNull(),
    price: (0, pg_core_1.numeric)("price", { precision: 10, scale: 2 }).notNull(),
    tax: (0, pg_core_1.numeric)("tax", { precision: 4, scale: 2 }).notNull(),
    totalPrice: (0, pg_core_1.numeric)("total_price", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).notNull().default("pending"),
    paymentStatus: (0, pg_core_1.varchar)("payment_status", { length: 20 })
        .notNull()
        .default("pending"),
    review: (0, pg_core_1.text)("review"),
    starRating: (0, pg_core_1.integer)("star_rating"),
    address: (0, pg_core_1.text)("address"),
    city: (0, pg_core_1.varchar)("city", { length: 100 }),
    country: (0, pg_core_1.varchar)("country", { length: 100 }),
    latitude: (0, pg_core_1.numeric)("latitude", { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.numeric)("longitude", { precision: 11, scale: 8 }),
    facilities: (0, pg_core_1.jsonb)("facilities").$type().default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
