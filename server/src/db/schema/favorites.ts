import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { hotels } from "./hotels";
import { users } from "./users";

export const favorites = pgTable("favorites", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    hotelId: uuid("hotel_id")
        .references(() => hotels.hotel_Id, {
            onDelete: "cascade",
        })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
