export type UserType = 'guest' | 'hotelier';

export interface User {
    id: string;
    name: string;
    email?: string;
    userType: UserType;
    createdAt: Date | null;  // 修改為允許 null
    updatedAt: Date | null;  // 修改為允許 null
}
