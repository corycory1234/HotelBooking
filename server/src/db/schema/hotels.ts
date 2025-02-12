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
    hotel_Id: uuid("id").defaultRandom().primaryKey(),
    hotel_Name: varchar("hotel_name", { length: 255 }).notNull(),
    hotel_Image_List: jsonb("hotel_image_list")
        .$type<
            {
                url: string;
                description: string;
            }[]
        >()
        .default([]),
    distance: varchar("distance", { length: 255 }),
    totalRating: numeric("total_rating", { precision: 3, scale: 1 }).notNull(),
    facility_List: jsonb("facility_list").$type<string[]>().default([]),
    price: numeric("price").notNull(),
    hotel_Intro: text("hotel_intro"),
    review_List: jsonb("review_list")
        .$type<
            {
                traveler_Id: string;
                traveler_Name: string;
                date: string;
                traveler_Rating: number;
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
    is_Open: boolean("is_open").default(true),
    hotel_Phone: varchar("hotel_phone", { length: 20 }).notNull(),
    hotel_Email: varchar("hotel_email", { length: 255 }).notNull(),
    cancellation_Policy: text("cancellation_policy"),
    transportation: text("transportation"),
    recommendation: text("recommendation"),
    isCollected: boolean("is_collected").default(false),
    offer_Id: varchar("offer_id", { length: 255 }),
    owner_Id: uuid("owner_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
