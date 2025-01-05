"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }), // 可為空，因為可能使用 Google 登入
    name: (0, pg_core_1.varchar)("name", { length: 255 }),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    avatar: (0, pg_core_1.text)("avatar"),
    provider: (0, pg_core_1.varchar)("provider", { length: 20 }).default("local"), // 提供者 local, google
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
