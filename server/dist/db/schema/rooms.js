"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomTypes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const hotels_1 = require("./hotels");
const users_1 = require("./users");
// 只保留房型定義
exports.roomTypes = (0, pg_core_1.pgTable)("room_types", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    hotelId: (0, pg_core_1.uuid)("hotel_id")
        .references(() => hotels_1.hotels.id, {
        onDelete: "cascade",
    })
        .notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by")
        .references(() => users_1.users.id, {
        onDelete: "set null",
    }),
    roomType: (0, pg_core_1.varchar)("room_type", { length: 50 }).notNull(),
    price: (0, pg_core_1.numeric)("price").notNull(),
    images: (0, pg_core_1.jsonb)("images")
        .$type()
        .default([]),
    availability: (0, pg_core_1.integer)("availability").notNull(),
    smoke: (0, pg_core_1.boolean)("smoke").default(false),
    amenity: (0, pg_core_1.jsonb)("amenity").$type().default([]),
    roomSize: (0, pg_core_1.numeric)("room_size", { precision: 5, scale: 2 }).notNull(), // 改為必填
    maxOccupancy: (0, pg_core_1.integer)("max_occupancy").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
