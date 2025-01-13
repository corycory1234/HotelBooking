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
const auth_service_1 = require("../services/auth.service");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: '未登入'
            });
        }
        const { data, error } = yield auth_service_1.authService.verifySession(accessToken);
        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: (error === null || error === void 0 ? void 0 : error.message) || '無效的 session'
            });
        }
        req.user = data.user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: '請重新登入'
        });
    }
});
exports.authMiddleware = authMiddleware;
