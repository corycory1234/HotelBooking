"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomTypes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const hotels_1 = require("./hotels");
const users_1 = require("./users");
exports.roomTypes = (0, pg_core_1.pgTable)("room_types", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    roomType: (0, pg_core_1.varchar)("room_type", { length: 50 }).notNull(),
    roomPrice: (0, pg_core_1.numeric)("room_price").notNull(),
    roomTypeImageList: (0, pg_core_1.jsonb)("room_type_image_list")
        .$type()
        .default([]),
    roomAvailability: (0, pg_core_1.integer)("room_availability").notNull(),
    smoke: (0, pg_core_1.boolean)("smoke").default(false),
    amenityList: (0, pg_core_1.jsonb)("amenity_list").$type().default([]),
    roomSize: (0, pg_core_1.numeric)("room_size").notNull(),
    maxPeople: (0, pg_core_1.integer)("max_people").notNull(),
    view: (0, pg_core_1.varchar)("view", { length: 255 }),
    bedType: (0, pg_core_1.varchar)("bed_type", { length: 255 }),
    hotelId: (0, pg_core_1.uuid)("hotel_id")
        .references(() => hotels_1.hotels.id, {
        onDelete: "cascade",
    })
        .notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by").references(() => users_1.users.id, {
        onDelete: "set null",
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
