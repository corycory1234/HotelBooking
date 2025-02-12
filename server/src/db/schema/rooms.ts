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
    roomType_Id: uuid("id").defaultRandom().primaryKey(),
    room_Type: varchar("room_type", { length: 50 }).notNull(),
    room_Price: numeric("room_price").notNull(),
    roomType_Image_List: jsonb("room_type_image_list")
        .$type<
            {
                url: string;
                description: string;
            }[]
        >()
        .default([]),
    room_Availability: integer("room_availability").notNull(),
    smoke: boolean("smoke").default(false),
    amenity_List: jsonb("amenity_list").$type<string[]>().default([]),
    room_Size: numeric("room_size").notNull(),
    max_People: integer("max_people").notNull(),
    view: varchar("view", { length: 255 }),
    bed_Type: varchar("bed_type", { length: 255 }),
    hotelId: uuid("hotel_id")
        .references(() => hotels.hotel_Id, {
            onDelete: "cascade",
        })
        .notNull(),
    createdBy: uuid("created_by").references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
