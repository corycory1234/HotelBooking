"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomTypes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const hotels_1 = require("./hotels");
const users_1 = require("./users");
exports.roomTypes = (0, pg_core_1.pgTable)("room_types", {
    roomType_Id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    room_Type: (0, pg_core_1.varchar)("room_type", { length: 50 }).notNull(),
    room_Price: (0, pg_core_1.numeric)("room_price").notNull(),
    roomType_Image_List: (0, pg_core_1.jsonb)("room_type_image_list")
        .$type()
        .default([]),
    room_Availability: (0, pg_core_1.integer)("room_availability").notNull(),
    smoke: (0, pg_core_1.boolean)("smoke").default(false),
    amenity_List: (0, pg_core_1.jsonb)("amenity_list").$type().default([]),
    room_Size: (0, pg_core_1.numeric)("room_size").notNull(),
    max_People: (0, pg_core_1.integer)("max_people").notNull(),
    view: (0, pg_core_1.varchar)("view", { length: 255 }),
    bed_Type: (0, pg_core_1.varchar)("bed_type", { length: 255 }),
    hotelId: (0, pg_core_1.uuid)("hotel_id")
        .references(() => hotels_1.hotels.hotel_Id, {
        onDelete: "cascade",
    })
        .notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by").references(() => users_1.users.id, {
        onDelete: "set null",
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
