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
exports.favoriteService = exports.FavoriteService = void 0;
const db_1 = require("../db");
const favorites_1 = require("../db/schema/favorites");
const hotels_1 = require("../db/schema/hotels");
const drizzle_orm_1 = require("drizzle-orm");
const base_service_1 = require("./base.service");
class FavoriteServiceError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.code = code;
        this.name = "FavoriteServiceError";
    }
}
class FavoriteService extends base_service_1.BaseService {
    getFavorites(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFavorites = yield db_1.db
                    .select({
                    favoriteId: favorites_1.favorites.id,
                    hotelId: favorites_1.favorites.hotelId,
                    hotel: hotels_1.hotels,
                })
                    .from(favorites_1.favorites)
                    .leftJoin(hotels_1.hotels, (0, drizzle_orm_1.eq)(favorites_1.favorites.hotelId, hotels_1.hotels.hotel_Id))
                    .where((0, drizzle_orm_1.eq)(favorites_1.favorites.userId, userId));
                return userFavorites;
            }
            catch (error) {
                throw new FavoriteServiceError("獲取最愛清單失敗");
            }
        });
    }
    addFavorite(userId, hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 檢查飯店是否存在
                const hotel = yield db_1.db
                    .select()
                    .from(hotels_1.hotels)
                    .where((0, drizzle_orm_1.eq)(hotels_1.hotels.hotel_Id, hotelId))
                    .then((rows) => rows[0]);
                if (!hotel) {
                    throw new FavoriteServiceError("飯店不存在", 404);
                }
                // 檢查是否已經加入最愛
                const existingFavorite = yield db_1.db
                    .select()
                    .from(favorites_1.favorites)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(favorites_1.favorites.userId, userId), (0, drizzle_orm_1.eq)(favorites_1.favorites.hotelId, hotelId)))
                    .then((rows) => rows[0]);
                if (existingFavorite) {
                    throw new FavoriteServiceError("此飯店已在最愛清單中", 400);
                }
                // 加入最愛
                yield db_1.db.insert(favorites_1.favorites).values({
                    userId,
                    hotelId,
                    createdAt: new Date(),
                });
                return { message: "成功加入最愛" };
            }
            catch (error) {
                if (error instanceof FavoriteServiceError) {
                    throw error;
                }
                throw new FavoriteServiceError("加入最愛失敗");
            }
        });
    }
    removeFavorite(userId, hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.db
                    .delete(favorites_1.favorites)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(favorites_1.favorites.userId, userId), (0, drizzle_orm_1.eq)(favorites_1.favorites.hotelId, hotelId)));
                if (!result) {
                    throw new FavoriteServiceError("找不到要刪除的最愛項目", 404);
                }
                return { message: "成功移除最愛" };
            }
            catch (error) {
                if (error instanceof FavoriteServiceError) {
                    throw error;
                }
                throw new FavoriteServiceError("移除最愛失敗");
            }
        });
    }
}
exports.FavoriteService = FavoriteService;
exports.favoriteService = new FavoriteService();
