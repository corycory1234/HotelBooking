import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    decimal,
    integer,
    boolean,
} from "drizzle-orm/pg-core";
import { hotels } from "./hotels";

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelId: uuid("hotel_id").references(() => hotels.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    capacity: integer("capacity").notNull(),
    quantity: integer("quantity").notNull(), // 房間數量
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const roomImages = pgTable("room_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id").references(() => rooms.id),
    url: varchar("url", { length: 255 }).notNull(),
    isMain: boolean("is_main").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
