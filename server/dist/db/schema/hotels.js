"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotels = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.hotels = (0, pg_core_1.pgTable)("hotels", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    address: (0, pg_core_1.text)("address").notNull(),
    latitude: (0, pg_core_1.decimal)("latitude", { precision: 10, scale: 8 }),
    longitude: (0, pg_core_1.decimal)("longitude", { precision: 11, scale: 8 }),
    amenities: (0, pg_core_1.jsonb)("amenities").$type(), // 設施列表
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
