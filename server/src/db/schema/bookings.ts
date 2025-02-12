import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    numeric,
    integer,
    date,
    text,
    jsonb,
} from "drizzle-orm/pg-core";
import { roomTypes } from "./rooms";
import { users } from "./users";
import { hotels } from "./hotels";

export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    hotelId: uuid("hotel_id").references(() => hotels.hotel_Id, {
        onDelete: "cascade",
    }).notNull(),
    roomId: uuid("room_id").references(() => roomTypes.roomType_Id, {
        onDelete: "cascade",
    }).notNull(),
    bookingImage: varchar("booking_image", { length: 255 }),
    travelerName: varchar("traveler_name", { length: 255 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }),
    checkInDate: date("check_in_date").notNull(),
    checkOutDate: date("check_out_date").notNull(),
    checkinTime: varchar("checkin_time", { length: 10 }).notNull(),
    checkoutTime: varchar("checkout_time", { length: 10 }).notNull(),
    adults: integer("adults").notNull(),
    children: integer("children").default(0),
    roomCount: integer("room_count").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    tax: numeric("tax", { precision: 4, scale: 2 }).notNull(),
    totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    paymentStatus: varchar("payment_status", { length: 20 })
        .notNull()
        .default("pending"),
    review: text("review"),
    starRating: integer("star_rating"),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }),
    latitude: numeric("latitude", { precision: 10, scale: 8 }),
    longitude: numeric("longitude", { precision: 11, scale: 8 }),
    facilities: jsonb("facilities").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
