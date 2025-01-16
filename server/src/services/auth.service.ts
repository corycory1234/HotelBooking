import { BaseService } from "./base.service";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { RegisterDTO, LoginDTO, UserType } from "../types/auth.types";

export class AuthService extends BaseService {
    private validatePassword(password: string): {
        isValid: boolean;
        message: string;
    } {
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
    async register(data: RegisterDTO) {
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
            const { data: authData, error: authError } =
                await this.supabase.auth.signUp({
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
                    const seconds = authError.message.match(/\d+/)?.[0] || "幾";
                    throw new Error(`請等待${seconds}秒後再試`);
                }
                throw new Error(authError.message || "註冊失敗，請稍後再試");
            }

            if (!authData.user) {
                throw new Error("註冊失敗");
            }

            // 創建用戶資料
            const [newUser] = await this.db
                .insert(users)
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
        } catch (error: any) {
            if (error.code === "23505") {
                // PostgreSQL 唯一約束違反的錯誤碼
                throw new Error("此用戶已存在，請使用其他電子郵件");
            }
            throw new Error(error.message || "註冊失敗，請稍後再試");
        }
    }

    // 用戶登入
    async login(data: LoginDTO) {
        try {
            // 驗證 email
            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                throw new Error("無效的電子郵件格式");
            }

            // Supabase Auth 登入
            const { data: authData, error: authError } =
                await this.supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });

            if (authError) {
                if (authError.code === "invalid_credentials") {
                    throw new Error("帳號或密碼錯誤");
                } else if (authError.code === "email_not_confirmed") {
                    throw new Error("請先驗證您的信箱");
                }

                throw authError;
            }

            // 獲取用戶資料
            const user = await this.db.query.users.findFirst({
                where: eq(users.id, authData.user.id),
            });

            if (!user) {
                throw new Error("User not found");
            }

            return {
                user,
                session: authData.session,
            };
        } catch (error) {
            throw error;
        }
    }

    // 登出
    async logout(refreshToken: string) {
        try {
            if (!refreshToken) {
                throw new Error("Invalid refresh token");
            }

            const { error } = await this.supabase.auth.signOut();

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
        } catch (error) {
            throw error;
        }
    }

    // 重設密碼郵件
    async forgotPassword(email: string) {
        try {
            // 驗證 email
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new Error("無效的電子郵件格式");
            }

            const { error } = await this.supabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
                    // redirectTo: "http://localhost:3001/reset-password",
                }
            );

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }

    // 獲取當前用戶資料
    async getCurrentUser(token: string) {
        try {
            // 先通過 token 獲取用戶資訊
            const {
                data: { user },
                error,
            } = await this.supabase.auth.getUser(token);

            if (error || !user) {
                throw new Error("Invalid token");
            }

            // 使用獲取到的 user.id (UUID) 去查詢資料庫
            const dbUser = await this.db.query.users.findFirst({
                where: eq(users.id, user.id),
            });

            if (!dbUser) {
                throw new Error("User not found");
            }

            // 合併 Supabase Auth 的 email 和資料庫的用戶資料
            return {
                ...dbUser,
                email: user.email,
            };
        } catch (error) {
            throw error;
        }
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
    async verifySession(accessToken: string) {
        try {
            if (!accessToken) {
                return {
                    data: { user: null },
                    error: new Error("未登入"),
                };
            }

            const { data, error } = await this.supabase.auth.getUser(
                accessToken
            );

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
            const dbUser = await this.db.query.users.findFirst({
                where: eq(users.id, data.user.id),
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
                    user: {
                        ...dbUser,
                        email: data.user.email,
                    },
                },
                error: null,
            };
        } catch (error: any) {
            return {
                data: { user: null },
                error: new Error(error.message),
            };
        }
    }

    // 刷新 token
    async refreshSession(refreshToken: string) {
        try {
            if (!refreshToken) {
                throw new Error("無效的 refresh token");
            }

            const { data, error } = await this.supabase.auth.refreshSession({
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
        } catch (error: any) {
            throw error;
        }
    }
}

// 導出實例
export const authService = new AuthService();
