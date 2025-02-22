"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomBasicTypes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.roomBasicTypes = (0, pg_core_1.pgTable)("room_basic_types", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 50 }).notNull().unique(),
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
