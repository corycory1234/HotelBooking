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
exports.authService = exports.AuthService = void 0;
const base_service_1 = require("./base.service");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class AuthService extends base_service_1.BaseService {
    validatePassword(password) {
        if (password.length < 8) {
            return { isValid: false, message: "密碼至少需要8個字符" };
        }
        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: "密碼需要包含至少一個大寫字母" };
        }
        if (!/[a-z]/.test(password)) {
            return { isValid: false, message: "密碼需要包含至少一個小寫字母" };
        }
        if (!/[0-9]/.test(password)) {
            return { isValid: false, message: "密碼需要包含至少一個數字" };
        }
        return { isValid: true, message: "" };
    }
    // 註冊新用戶
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // 先檢查所有必填欄位是否存在
                if (!data.email || !data.password || !data.name || !data.userType) {
                    throw new Error("所有欄位都是必填的");
                }
                const passwordValidation = this.validatePassword(data.password);
                if (!passwordValidation.isValid) {
                    throw new Error(passwordValidation.message);
                }
                // 驗證 email
                if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    throw new Error("無效的電子郵件格式");
                }
                // 驗證 name
                if (!data.name || data.name.length < 2 || data.name.length > 20) {
                    throw new Error("名稱長度必須在2-20個字符之間");
                }
                // 驗證 userType
                if (!["guest", "hotelier"].includes(data.userType)) {
                    throw new Error("無效的用戶類型");
                }
                // 使用 Supabase Auth 創建用戶
                const { data: authData, error: authError } = yield this.supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            name: data.name,
                            userType: data.userType,
                        },
                    },
                });
                if (authError) {
                    if (authError.code === "over_email_send_rate_limit") {
                        const seconds = ((_a = authError.message.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || "幾";
                        throw new Error(`請等待${seconds}秒後再試`);
                    }
                    throw new Error(authError.message || "註冊失敗，請稍後再試");
                }
                if (!authData.user) {
                    throw new Error("註冊失敗");
                }
                // 創建用戶資料
                const [newUser] = yield this.db
                    .insert(schema_1.users)
                    .values({
                    id: authData.user.id,
                    name: data.name,
                    userType: data.userType,
                })
                    .returning();
                return {
                    user: newUser,
                    session: authData.session,
                };
            }
            catch (error) {
                if (error.code === "23505") {
                    // PostgreSQL 唯一約束違反的錯誤碼
                    throw new Error("此用戶已存在，請使用其他電子郵件");
                }
                throw new Error(error.message || "註冊失敗，請稍後再試");
            }
        });
    }
    // 用戶登入
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 驗證 email
                if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    throw new Error("無效的電子郵件格式");
                }
                // Supabase Auth 登入
                const { data: authData, error: authError } = yield this.supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });
                if (authError) {
                    if (authError.code === "invalid_credentials") {
                        throw new Error("帳號或密碼錯誤");
                    }
                    else if (authError.code === "email_not_confirmed") {
                        throw new Error("請先驗證您的信箱");
                    }
                    throw authError;
                }
                // 獲取用戶資料
                const user = yield this.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.id, authData.user.id),
                });
                if (!user) {
                    throw new Error("User not found");
                }
                return {
                    user,
                    session: authData.session,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Google 登入
    googleLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { user, session }, error, } = yield this.supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: data.credential,
                    nonce: "NONCE",
                });
                if (error)
                    throw error;
                if (!user || !session)
                    throw new Error("Google 登入失敗");
                // 檢查用戶是否已存在
                let dbUser = yield this.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.id, user.id),
                });
                // 如果用戶不存在，建立新用戶
                if (!dbUser) {
                    const [newUser] = yield this.db
                        .insert(schema_1.users)
                        .values({
                        id: user.id,
                        name: user.user_metadata.full_name || "用戶",
                        userType: "guest", // 預設為一般用戶
                    })
                        .returning();
                    dbUser = newUser;
                }
                return {
                    user: Object.assign(Object.assign({}, dbUser), { email: user.email }),
                    session,
                };
            }
            catch (error) {
                throw new Error(error.message || "Google 登入失敗");
            }
        });
    }
    // 登出
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refreshToken) {
                    throw new Error("Invalid refresh token");
                }
                const { error } = yield this.supabase.auth.signOut();
                if (error) {
                    // 根据 Supabase 的错误类型处理
                    switch (error.message) {
                        case "Invalid refresh token":
                            throw new Error("無效的 session");
                        default:
                            throw new Error("登出失敗，請稍後再試");
                    }
                }
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // 重設密碼郵件
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 驗證 email
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error("無效的電子郵件格式");
                }
                const { error } = yield this.supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
                    // redirectTo: "http://localhost:3001/reset-password",
                });
                if (error)
                    throw error;
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // 獲取當前用戶資料
    getCurrentUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 先通過 token 獲取用戶資訊
                const { data: { user }, error, } = yield this.supabase.auth.getUser(token);
                if (error || !user) {
                    throw new Error("Invalid token");
                }
                // 使用獲取到的 user.id (UUID) 去查詢資料庫
                const dbUser = yield this.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.id, user.id),
                });
                if (!dbUser) {
                    throw new Error("User not found");
                }
                // 合併 Supabase Auth 的 email 和資料庫的用戶資料
                return Object.assign(Object.assign({}, dbUser), { email: user.email });
            }
            catch (error) {
                throw error;
            }
        });
    }
    // 更新用戶資料
    // async updateUser(
    //     userId: string,
    //     data: { name?: string; userType?: UserType }
    // ) {
    //     try {
    //         const [updatedUser] = await this.db
    //             .update(users)
    //             .set({
    //                 ...data,
    //                 updatedAt: new Date(),
    //             })
    //             .where(eq(users.id, userId))
    //             .returning();
    //         return updatedUser;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // 驗證 session
    verifySession(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!accessToken) {
                    return {
                        data: { user: null },
                        error: new Error("未登入"),
                    };
                }
                const { data, error } = yield this.supabase.auth.getUser(accessToken);
                if (error) {
                    return {
                        data: { user: null },
                        error: new Error("未登入"), // 將所有認證錯誤統一顯示為"未登入"
                    };
                }
                if (!data.user) {
                    return {
                        data: { user: null },
                        error: new Error("使用者不存在"),
                    };
                }
                // 檢查資料庫中的用戶資料
                const dbUser = yield this.db.query.users.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.users.id, data.user.id),
                });
                if (!dbUser) {
                    return {
                        data: { user: null },
                        error: new Error("使用者資料不存在"),
                    };
                }
                // 明確返回非 null 的用戶資料
                return {
                    data: {
                        user: Object.assign(Object.assign({}, dbUser), { email: data.user.email }),
                    },
                    error: null,
                };
            }
            catch (error) {
                return {
                    data: { user: null },
                    error: new Error(error.message),
                };
            }
        });
    }
    // 刷新 token
    refreshSession(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refreshToken) {
                    throw new Error("無效的 refresh token");
                }
                const { data, error } = yield this.supabase.auth.refreshSession({
                    refresh_token: refreshToken,
                });
                if (error) {
                    if (error.message === "Invalid refresh token") {
                        throw new Error("Session 已過期，請重新登入");
                    }
                    throw error;
                }
                if (!data.session) {
                    throw new Error("刷新 session 失敗");
                }
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
// 導出實例
exports.authService = new AuthService();
