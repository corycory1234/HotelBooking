// import {
//     pgTable,
//     uuid,
//     varchar,
//     timestamp,
//     decimal,
//     integer,
//     date,
// } from "drizzle-orm/pg-core";
// import { rooms } from "./rooms";
// import { users } from "./users";

// export const bookings = pgTable("bookings", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     userId: uuid("user_id").references(() => users.id), // 新增用戶關聯
//     roomId: uuid("room_id").references(() => rooms.id),
//     customerName: varchar("customer_name", { length: 255 }).notNull(),
//     customerEmail: varchar("customer_email", { length: 255 }).notNull(),
//     customerPhone: varchar("customer_phone", { length: 20 }),
//     checkInDate: date("check_in_date").notNull(),
//     checkOutDate: date("check_out_date").notNull(),
//     adults: integer("adults").notNull(),
//     children: integer("children").default(0),
//     totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
//     status: varchar("status", { length: 20 }).notNull().default("pending"),
//     paymentStatus: varchar("payment_status", { length: 20 })
//         .notNull()
//         .default("pending"),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });
