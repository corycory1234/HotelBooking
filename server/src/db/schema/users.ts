import { pgTable, uuid, varchar, timestamp, text, pgEnum } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum('user_type', ['guest', 'hotelier']);

export const users = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    userType: userTypeEnum('user_type').notNull().default('guest'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
