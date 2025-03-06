"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_1 = require("../utils/supabase");
const db_1 = require("../db");
const users_1 = require("../db/schema/users");
const drizzle_orm_1 = require("drizzle-orm");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "未提供認證令牌" });
            return;
        }
        const { data: { user }, error, } = yield supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            res.status(403).json({ message: "無效的認證令牌" });
            return;
        }
        const dbUser = yield db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(users_1.users.id, user.id),
        });
        if (!dbUser) {
            res.status(403).json({ message: "用戶不存在" });
            return;
        }
        // 設置完整的用戶資訊
        req.user = {
            id: dbUser.id,
            name: dbUser.name,
            email: (_b = user.email) !== null && _b !== void 0 ? _b : undefined,
            userType: dbUser.userType,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "驗證失敗" });
    }
});
exports.authMiddleware = authMiddleware;
