"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomImages = exports.rooms = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const hotels_1 = require("./hotels");
exports.rooms = (0, pg_core_1.pgTable)("rooms", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    hotelId: (0, pg_core_1.uuid)("hotel_id").references(() => hotels_1.hotels.id),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    capacity: (0, pg_core_1.integer)("capacity").notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(), // 房間數量
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.roomImages = (0, pg_core_1.pgTable)("room_images", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    roomId: (0, pg_core_1.uuid)("room_id").references(() => exports.rooms.id),
    url: (0, pg_core_1.varchar)("url", { length: 255 }).notNull(),
    isMain: (0, pg_core_1.boolean)("is_main").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
