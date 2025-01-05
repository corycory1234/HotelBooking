"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const rooms_1 = require("./rooms");
const users_1 = require("./users");
exports.bookings = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.users.id), // 新增用戶關聯
    roomId: (0, pg_core_1.uuid)("room_id").references(() => rooms_1.rooms.id),
    customerName: (0, pg_core_1.varchar)("customer_name", { length: 255 }).notNull(),
    customerEmail: (0, pg_core_1.varchar)("customer_email", { length: 255 }).notNull(),
    customerPhone: (0, pg_core_1.varchar)("customer_phone", { length: 20 }),
    checkInDate: (0, pg_core_1.date)("check_in_date").notNull(),
    checkOutDate: (0, pg_core_1.date)("check_out_date").notNull(),
    adults: (0, pg_core_1.integer)("adults").notNull(),
    children: (0, pg_core_1.integer)("children").default(0),
    totalPrice: (0, pg_core_1.decimal)("total_price", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).notNull().default("pending"),
    paymentStatus: (0, pg_core_1.varchar)("payment_status", { length: 20 })
        .notNull()
        .default("pending"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
