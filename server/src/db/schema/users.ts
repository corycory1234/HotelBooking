import { pgTable, uuid, varchar, timestamp, text, pgEnum } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum('user_type', ['traveler', 'hotel_owner']);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    userType: userTypeEnum('user_type').notNull(),
    name: varchar("name", { length: 255 }),
    hotelName: text('hotel_name'),
    avatar: text("avatar"),
    provider: varchar("provider", { length: 20 }).default("local"), // 提供者 local, google
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
