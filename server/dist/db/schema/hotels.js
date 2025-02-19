"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotels = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.hotels = (0, pg_core_1.pgTable)("hotels", {
    hotel_Id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    hotel_Name: (0, pg_core_1.varchar)("hotel_name", { length: 255 }).notNull(),
    hotel_Image_List: (0, pg_core_1.jsonb)("hotel_image_list")
        .$type()
        .default([]),
    distance: (0, pg_core_1.varchar)("distance", { length: 255 }),
    totalRating: (0, pg_core_1.numeric)("total_rating", { precision: 3, scale: 1 }).notNull(),
    facility_List: (0, pg_core_1.jsonb)("facility_list").$type().default([]),
    price: (0, pg_core_1.numeric)("price").notNull(),
    hotel_Intro: (0, pg_core_1.text)("hotel_intro"),
    review_List: (0, pg_core_1.jsonb)("review_list")
        .$type()
        .default([]),
    address: (0, pg_core_1.text)("address").notNull(),
    country: (0, pg_core_1.varchar)("country", { length: 100 }).notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 100 }).notNull(),
    tax: (0, pg_core_1.numeric)("tax", { precision: 4, scale: 2 }),
    checkin: (0, pg_core_1.time)("checkin").notNull(),
    checkout: (0, pg_core_1.time)("checkout").notNull(),
    latitude: (0, pg_core_1.varchar)("latitude", { length: 20 }),
    longitude: (0, pg_core_1.varchar)("longitude", { length: 20 }),
    is_Open: (0, pg_core_1.boolean)("is_open").default(true),
    hotel_Phone: (0, pg_core_1.varchar)("hotel_phone", { length: 20 }).notNull(),
    hotel_Email: (0, pg_core_1.varchar)("hotel_email", { length: 255 }).notNull(),
    cancellation_Policy: (0, pg_core_1.text)("cancellation_policy"),
    transportation: (0, pg_core_1.text)("transportation"),
    recommendation: (0, pg_core_1.text)("recommendation"),
    isCollected: (0, pg_core_1.boolean)("is_collected").default(false),
    offer_Id: (0, pg_core_1.varchar)("offer_id", { length: 255 }),
    owner_Id: (0, pg_core_1.uuid)("owner_id")
        .references(() => users_1.users.id, {
        onDelete: "cascade",
    })
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
