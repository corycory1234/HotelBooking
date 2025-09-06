"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.userTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userTypeEnum = (0, pg_core_1.pgEnum)('user_type', ['guest', 'hotelier']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    userType: (0, exports.userTypeEnum)('user_type').notNull().default('guest'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
