// import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
// import { hotels } from "./hotels";
// import { users } from "./users";

// export const favorites = pgTable("favorites", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     userId: uuid("user_id").references(() => users.id),
//     hotelId: uuid("hotel_id").references(() => hotels.id),
//     createdAt: timestamp("created_at").defaultNow(),
// });
