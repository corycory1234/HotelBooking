"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviews = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const hotels_1 = require("./hotels");
const bookings_1 = require("./bookings");
const users_1 = require("./users");
exports.reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.users.id), // 新增用戶關聯
    hotelId: (0, pg_core_1.uuid)("hotel_id").references(() => hotels_1.hotels.id),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(() => bookings_1.bookings.id),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    comment: (0, pg_core_1.text)("comment"),
    reply: (0, pg_core_1.text)("reply"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
