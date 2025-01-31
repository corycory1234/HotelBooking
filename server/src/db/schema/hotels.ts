import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    jsonb,
    numeric,
    time,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const hotels = pgTable("hotels", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    distance: varchar("distance", { length: 255 }),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull(),
    facilities: jsonb("facilities").$type<string[]>().notNull().default([]),
    price: numeric("price").notNull(),
    intro: jsonb("intro").$type<string[]>().default([]),
    reviews: jsonb("reviews")
        .$type<
            {
                id: string;
                name: string;
                date: string;
                rating: number;
                comment: string;
            }[]
        >()
        .default([]),
    address: text("address").notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    tax: numeric("tax", { precision: 4, scale: 2 }),
    checkin: time("checkin").notNull(),
    checkout: time("checkout").notNull(),
    latitude: numeric("latitude", { precision: 10, scale: 8 }),
    longitude: numeric("longitude", { precision: 11, scale: 8 }),
    hotelPhone: varchar("hotel_phone", { length: 20 }).notNull(),
    hotelEmail: varchar("hotel_email", { length: 255 }).notNull(),
    cancellationPolicy: text("cancellation_policy"),
    transportation: text("transportation"),
    recommendation: text("recommendation"),
    images: jsonb("images")
        .$type<
            {
                url: string;
                path?: string;
                description?: string;
                main?: boolean; // 標記為主要圖片
            }[]
        >()
        .default([]),
    ownerId: uuid("owner_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
