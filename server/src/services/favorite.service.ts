import { db } from "../db";
import { favorites } from "../db/schema/favorites";
import { hotels } from "../db/schema/hotels";
import { eq, and } from "drizzle-orm";
import { BaseService } from "./base.service";

class FavoriteServiceError extends Error {
    constructor(message: string, public code: number = 500) {
        super(message);
        this.name = "FavoriteServiceError";
    }
}

export class FavoriteService extends BaseService {
    async getFavorites(userId: string) {
        try {
            const userFavorites = await db
                .select({
                    favoriteId: favorites.id,
                    hotelId: favorites.hotelId,
                    hotel: hotels,
                })
                .from(favorites)
                .leftJoin(hotels, eq(favorites.hotelId, hotels.hotel_Id))
                .where(eq(favorites.userId, userId));

            return userFavorites;
        } catch (error) {
            throw new FavoriteServiceError("獲取最愛清單失敗");
        }
    }

    async addFavorite(userId: string, hotelId: string) {
        try {
            // 檢查飯店是否存在
            const hotel = await db
                .select()
                .from(hotels)
                .where(eq(hotels.hotel_Id, hotelId))
                .then((rows) => rows[0]);

            if (!hotel) {
                throw new FavoriteServiceError("飯店不存在", 404);
            }

            // 檢查是否已經加入最愛
            const existingFavorite = await db
                .select()
                .from(favorites)
                .where(
                    and(
                        eq(favorites.userId, userId),
                        eq(favorites.hotelId, hotelId)
                    )
                )
                .then((rows) => rows[0]);

            if (existingFavorite) {
                throw new FavoriteServiceError("此飯店已在最愛清單中", 400);
            }

            // 加入最愛
            await db.insert(favorites).values({
                userId,
                hotelId,
                createdAt: new Date(),
            });

            return { message: "成功加入最愛" };
        } catch (error) {
            if (error instanceof FavoriteServiceError) {
                throw error;
            }
            throw new FavoriteServiceError("加入最愛失敗");
        }
    }

    async removeFavorite(userId: string, hotelId: string) {
        try {
            const result = await db
                .delete(favorites)
                .where(
                    and(
                        eq(favorites.userId, userId),
                        eq(favorites.hotelId, hotelId)
                    )
                );

            if (!result) {
                throw new FavoriteServiceError("找不到要刪除的最愛項目", 404);
            }

            return { message: "成功移除最愛" };
        } catch (error) {
            if (error instanceof FavoriteServiceError) {
                throw error;
            }
            throw new FavoriteServiceError("移除最愛失敗");
        }
    }
}

export const favoriteService = new FavoriteService();
