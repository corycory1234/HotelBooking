"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favorites = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const hotels_1 = require("./hotels");
const users_1 = require("./users");
exports.favorites = (0, pg_core_1.pgTable)("favorites", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => users_1.users.id, {
        onDelete: "cascade",
    })
        .notNull(),
    hotelId: (0, pg_core_1.uuid)("hotel_id")
        .references(() => hotels_1.hotels.hotel_Id, {
        onDelete: "cascade",
    })
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
