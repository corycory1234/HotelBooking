import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const roomBasicTypes = pgTable("room_basic_types", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
});

// 可以使用以下 SQL 插入基本資料：
/*
INSERT INTO room_basic_types (name) VALUES
    ('singleroom'),
    ('doubleroom'),
    ('twinroom'),
    ('queenroom'),
    ('kingroom');
*/
