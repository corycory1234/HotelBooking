import { userTypeEnum } from "../db/schema";

// 從 enum 中獲取類型
export type UserType = (typeof userTypeEnum.enumValues)[number];

// 註冊 DTO
export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
    userType?: UserType;
}

// 登入 DTO
export interface LoginDTO {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    userType: string;
}