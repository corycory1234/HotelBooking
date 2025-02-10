import {
    pgTable,
    uuid,
    varchar,
    numeric,
    timestamp,
    integer,
    boolean,
    jsonb,
} from "drizzle-orm/pg-core";
import { hotels } from "./hotels";
import { users } from "./users";

export const roomTypes = pgTable("room_types", {
    id: uuid("id").defaultRandom().primaryKey(),
    roomTypeId: varchar("room_type_id", { length: 255 }).notNull(),
    roomType: varchar("room_type", { length: 50 }).notNull(),
    roomPrice: numeric("room_price").notNull(),
    roomTypeImageList: jsonb("room_type_image_list")
        .$type<
            {
                url: string;
                description: string;
            }[]
        >()
        .default([]),
    roomAvailability: integer("room_availability").notNull(),
    smoke: boolean("smoke").default(false),
    amenityList: jsonb("amenity_list").$type<string[]>().default([]),
    roomSize: numeric("room_size").notNull(),
    maxPeople: integer("max_people").notNull(),
    view: varchar("view", { length: 255 }),
    bedType: varchar("bed_type", { length: 255 }),
    hotelId: uuid("hotel_id")
        .references(() => hotels.id, {
            onDelete: "cascade",
        })
        .notNull(),
    createdBy: uuid("created_by").references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
