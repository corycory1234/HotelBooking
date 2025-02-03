"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotels = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.hotels = (0, pg_core_1.pgTable)("hotels", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    distance: (0, pg_core_1.varchar)("distance", { length: 255 }),
    rating: (0, pg_core_1.numeric)("rating", { precision: 3, scale: 2 }).notNull(),
    facilities: (0, pg_core_1.jsonb)("facilities").$type().notNull().default([]),
    price: (0, pg_core_1.numeric)("price").notNull(),
    intro: (0, pg_core_1.jsonb)("intro").$type().default([]),
    reviews: (0, pg_core_1.jsonb)("reviews")
        .$type()
        .default([]),
    address: (0, pg_core_1.text)("address").notNull(),
    country: (0, pg_core_1.varchar)("country", { length: 100 }).notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 100 }).notNull(),
    tax: (0, pg_core_1.numeric)("tax", { precision: 4, scale: 2 }),
    checkin: (0, pg_core_1.time)("checkin").notNull(),
    checkout: (0, pg_core_1.time)("checkout").notNull(),
    latitude: (0, pg_core_1.numeric)("latitude", { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.numeric)("longitude", { precision: 11, scale: 8 }),
    hotelPhone: (0, pg_core_1.varchar)("hotel_phone", { length: 20 }).notNull(),
    hotelEmail: (0, pg_core_1.varchar)("hotel_email", { length: 255 }).notNull(),
    cancellationPolicy: (0, pg_core_1.text)("cancellation_policy"),
    transportation: (0, pg_core_1.text)("transportation"),
    recommendation: (0, pg_core_1.text)("recommendation"),
    images: (0, pg_core_1.jsonb)("images")
        .$type()
        .default([]),
    ownerId: (0, pg_core_1.uuid)("owner_id")
        .references(() => users_1.users.id, {
        onDelete: "cascade",
    })
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
