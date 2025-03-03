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
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
exports.authController = {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name, userType } = req.body;
                const result = yield auth_service_1.authService.register({
                    email,
                    password,
                    name,
                    userType,
                });
                res.status(201).json({
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.authService.login(req.body);
                // 設置 cookies
                if (result.session) {
                    res.cookie("access_token", result.session.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 在 production 時設為 none
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        domain: process.env.COOKIE_DOMAIN || undefined, // 設定 cookie domain
                    });
                    res.cookie("refresh_token", result.session.refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 在 production 時設為 none
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                        domain: process.env.COOKIE_DOMAIN || undefined, // 設定 cookie domain
                    });
                }
                res.json({
                    success: true,
                    data: {
                        user: {
                            id: result.user.id,
                            name: result.user.name,
                            userType: result.user.userType,
                            email: result.session.user.email,
                        },
                    },
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    },
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.authService.googleLogin(req.body);
                // 設置 cookies
                if (result.session) {
                    res.cookie("access_token", result.session.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        domain: process.env.COOKIE_DOMAIN || undefined,
                    });
                    res.cookie("refresh_token", result.session.refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        domain: process.env.COOKIE_DOMAIN || undefined,
                    });
                }
                res.json({
                    success: true,
                    data: {
                        user: {
                            id: result.user.id,
                            name: result.user.name,
                            userType: result.user.userType,
                            email: result.user.email,
                        },
                    },
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    },
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                if (!accessToken) {
                    res.status(401).json({
                        success: false,
                        message: "無法存取或 Session 已過期",
                    });
                    return;
                }
                yield auth_service_1.authService.logout(accessToken);
                res.clearCookie("access_token");
                res.json({
                    success: true,
                    message: "登出成功",
                });
                return;
            }
            catch (error) {
                if (error.message === "Invalid token") {
                    res.status(401).json({
                        success: false,
                        message: "無效的 Session",
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    message: "登出失敗，請稍後再試",
                });
                return;
            }
        });
    },
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield auth_service_1.authService.forgotPassword(email);
                res.json({
                    success: true,
                    message: "重設密碼郵件已發送",
                });
                return;
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
        });
    },
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                if (!token) {
                    res.status(401).json({
                        success: false,
                        message: "未登入",
                    });
                    return;
                }
                const user = yield auth_service_1.authService.getCurrentUser(token);
                res.json({
                    success: true,
                    data: {
                        id: user.id,
                        name: user.name,
                        userType: user.userType,
                        email: user.email,
                    },
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
        });
    },
    verifySession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                if (!accessToken) {
                    res.status(401).json({
                        success: false,
                        message: "未登入",
                    });
                    return;
                }
                const result = yield auth_service_1.authService.verifySession(accessToken);
                if (result.error) {
                    res.status(401).json({
                        success: false,
                        message: result.error.message,
                    });
                    return;
                }
                res.json({
                    success: true,
                    data: result.data,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    },
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
                if (!refreshToken) {
                    res.status(401).json({
                        success: false,
                        message: "未登入",
                    });
                    return;
                }
                const result = yield auth_service_1.authService.refreshSession(refreshToken);
                if (result.session) {
                    // 更新 access_token
                    res.cookie("access_token", result.session.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    });
                    // 更新 refresh_token
                    res.cookie("refresh_token", result.session.refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    });
                }
                // 簡化回應內容，只需要告訴前端更新成功即可
                res.json({
                    success: true,
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: "請重新登入",
                });
            }
        });
    },
};
