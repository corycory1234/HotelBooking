import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    decimal,
    jsonb,
} from "drizzle-orm/pg-core";

export const hotels = pgTable("hotels", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    address: text("address").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    amenities: jsonb("amenities").$type<string[]>(), // 設施列表
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
