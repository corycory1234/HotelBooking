// import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
// import { hotels } from "./hotels";
// import { bookings } from "./bookings";
// import { users } from "./users";

// export const reviews = pgTable("reviews", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     userId: uuid("user_id").references(() => users.id), // 新增用戶關聯
//     hotelId: uuid("hotel_id").references(() => hotels.id),
//     bookingId: uuid("booking_id").references(() => bookings.id),
//     rating: integer("rating").notNull(),
//     comment: text("comment"),
//     reply: text("reply"),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });
