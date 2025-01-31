import {
    pgTable,
    uuid,
    varchar,
    numeric,
    timestamp,
    integer,
    boolean,
    jsonb,
} from "drizzle-orm/pg-core";
import { hotels } from "./hotels";
import { users } from "./users";

// 只保留房型定義
export const roomTypes = pgTable("room_types", {
    id: uuid("id").defaultRandom().primaryKey(),
    hotelId: uuid("hotel_id")
        .references(() => hotels.id, {
            onDelete: "cascade",
        })
        .notNull(),
    createdBy: uuid("created_by")
        .references(() => users.id, {
            onDelete: "set null",
        }),
    roomType: varchar("room_type", { length: 50 }).notNull(),
    price: numeric("price").notNull(),
    images: jsonb("images")
        .$type<
            {
                url: string;
                path?: string;  // 新增 Supabase Storage 路徑
                description?: string;
            }[]
        >()
        .default([]),
    availability: integer("availability").notNull(),
    smoke: boolean("smoke").default(false),
    amenity: jsonb("amenity").$type<string[]>().default([]),
    roomSize: numeric("room_size", { precision: 5, scale: 2 }).notNull(), // 改為必填
    maxOccupancy: integer("max_occupancy").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
