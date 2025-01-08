import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    decimal,
    integer,
    boolean,
    jsonb,
} from "drizzle-orm/pg-core";
import { hotels } from "./hotels";
import { RoomImage } from "../../types/room";

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelId: uuid("hotel_id").references(() => hotels.id),
    roomType: text("room_type").notNull(),
    price: decimal("price").notNull(),
    images: jsonb("images").$type<RoomImage[]>(),
    availability: decimal("availability"),
    smoke: boolean("smoke").default(false),
    amenity: jsonb("amenity").$type<string[]>(),
    roomsize: decimal("roomsize").notNull(),
    maxOccupancy: decimal("max_occupancy").notNull(),
    quantity: integer("quantity").notNull(), // 房間數量
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
