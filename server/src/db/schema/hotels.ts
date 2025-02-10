import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    jsonb,
    numeric,
    time,
    boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const hotels = pgTable("hotels", {
    id: uuid("id").defaultRandom().primaryKey(),
    hotelId: varchar("hotel_id", { length: 255 }).notNull(),
    hotelName: varchar("hotel_name", { length: 255 }).notNull(),
    hotelImageList: jsonb("hotel_image_list")
        .$type<
            {
                url: string;
                description: string;
            }[]
        >()
        .default([]),
    distance: varchar("distance", { length: 255 }),
    totalRating: numeric("total_rating", { precision: 3, scale: 1 }).notNull(),
    facilityList: jsonb("facility_list").$type<string[]>().default([]),
    price: numeric("price").notNull(),
    hotelIntro: text("hotel_intro"),
    reviewList: jsonb("review_list")
        .$type<
            {
                travelerId: string;
                travelerName: string;
                date: string;
                travelerRating: number;
                comment: string;
                reply: string;
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
    isOpen: boolean("is_open").default(true),
    hotelPhone: varchar("hotel_phone", { length: 20 }).notNull(),
    hotelEmail: varchar("hotel_email", { length: 255 }).notNull(),
    cancellationPolicy: text("cancellation_policy"),
    transportation: text("transportation"),
    recommendation: text("recommendation"),
    isCollected: boolean("is_collected").default(false),
    offerId: varchar("offer_id", { length: 255 }),
    ownerId: uuid("owner_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
