// import {
//     pgTable,
//     uuid,
//     varchar,
//     text,
//     timestamp,
//     decimal,
//     jsonb,
//     integer
// } from "drizzle-orm/pg-core";
// import { HotelImage, HotelReview } from "../../types/hotel";
// import { RoomType } from "../../types/room";

// export const hotels = pgTable("hotels", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     name: varchar("name", { length: 255 }).notNull(),
//     images: jsonb("images").$type<HotelImage[]>(),
//     distance: text("distance"),
//     rating: decimal("rating", { precision: 3, scale: 1 }),
//     facilities: jsonb("facilities").$type<string[]>().notNull(), // 設施列表
//     price: integer("price").notNull(),
//     intro: jsonb("intro").$type<string[]>(),
//     reviews: jsonb("reviews").$type<HotelReview[]>(),
//     address: text("address").notNull(),
//     country: text("country").notNull(),
//     city: text("city").notNull(),
//     roomType: jsonb("room_type").$type<RoomType[]>(),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });
