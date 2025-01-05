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
exports.authenticate = void 0;
const db_1 = require("../db");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            throw new Error("No token provided");
        }
        const { data: { user }, error, } = yield db_1.supabase.auth.getUser(token);
        if (error || !user) {
            throw new Error("Invalid token");
        }
        // 將用戶信息添加到 request 對象
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }
});
exports.authenticate = authenticate;
