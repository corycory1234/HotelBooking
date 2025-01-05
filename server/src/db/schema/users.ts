import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }), // 可為空，因為可能使用 Google 登入
    name: varchar("name", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    avatar: text("avatar"),
    provider: varchar("provider", { length: 20 }).default("local"), // 提供者 local, google
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
