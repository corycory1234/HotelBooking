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
exports.reviewService = exports.ReviewService = void 0;
const base_service_1 = require("./base.service");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const bookings_1 = require("../db/schema/bookings");
const drizzle_orm_1 = require("drizzle-orm");
class ReviewServiceError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.code = code;
        this.name = "ReviewServiceError";
    }
}
class ReviewService extends base_service_1.BaseService {
    // 新增一個私有方法來標準化評論格式
    standardizeReview(review) {
        return {
            traveler_Id: review.traveler_Id || review.travelerId,
            traveler_Name: review.traveler_Name || review.travelerName,
            traveler_Rating: review.traveler_Rating || review.travelerRating,
            comment: review.comment,
            date: review.date,
            reply: review.reply,
        };
    }
    createReview(reviewData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token) {
                    throw new ReviewServiceError("未提供認證信息", 401);
                }
                const { data: { user }, error: authError, } = yield this.supabase.auth.getUser(token);
                if (authError || !user) {
                    throw new ReviewServiceError("無效的認證信息", 401);
                }
                // 查詢訂單資訊
                const booking = yield db_1.db
                    .select()
                    .from(bookings_1.bookings)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_1.bookings.id, reviewData.bookingId), (0, drizzle_orm_1.eq)(bookings_1.bookings.userId, user.id)))
                    .then((rows) => rows[0]);
                if (!booking) {
                    throw new ReviewServiceError("找不到對應的訂單或無權限", 404);
                }
                // 檢查訂單狀態是否為已完成
                if (booking.status !== "confirmed") {
                    throw new ReviewServiceError("只能評價已完成的訂單", 400);
                }
                // 檢查是否已經評價過
                if (booking.review || booking.starRating) {
                    throw new ReviewServiceError("此訂單已經評價過", 400);
                }
                // 檢查飯店是否存在
                const hotel = yield db_1.db
                    .select()
                    .from(schema_1.hotels)
                    .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, booking.hotelId))
                    .then((rows) => rows[0]);
                if (!hotel) {
                    throw new ReviewServiceError("飯店不存在", 404);
                }
                // 準備新評價資料
                const newReview = {
                    traveler_Id: user.id,
                    traveler_Name: booking.travelerName,
                    traveler_Rating: reviewData.rating,
                    comment: reviewData.comment,
                    date: new Date().toISOString(),
                    reply: "",
                };
                // 更新訂單的評價資訊
                yield db_1.db
                    .update(bookings_1.bookings)
                    .set({
                    review: reviewData.comment,
                    starRating: reviewData.rating,
                    updatedAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(bookings_1.bookings.id, reviewData.bookingId));
                // 更新飯店的評價列表
                const currentReviews = (hotel.review_List || []).map((review) => this.standardizeReview(review));
                const updatedReviews = [...currentReviews, newReview];
                // 計算新的平均評分
                const totalRating = updatedReviews.reduce((sum, review) => sum + review.traveler_Rating, 0) / updatedReviews.length;
                // 更新飯店資料
                yield db_1.db
                    .update(schema_1.hotels)
                    .set({
                    review_List: updatedReviews,
                    totalRating: totalRating.toString(),
                    updatedAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotel_Id, booking.hotelId));
                return newReview;
            }
            catch (error) {
                console.error("Create review error:", error);
                if (error instanceof ReviewServiceError) {
                    throw error;
                }
                throw new ReviewServiceError(error instanceof Error ? error.message : "新增評價失敗", 500);
            }
        });
    }
    validateReviewData(data) {
        var _a;
        if (!data.bookingId) {
            return { isValid: false, error: "訂單ID為必填" };
        }
        if (data.rating === undefined || data.rating < 1 || data.rating > 5) {
            return { isValid: false, error: "評分必須介於 1-5 之間" };
        }
        if (!((_a = data.comment) === null || _a === void 0 ? void 0 : _a.trim())) {
            return { isValid: false, error: "評論內容為必填" };
        }
        return { isValid: true };
    }
}
exports.ReviewService = ReviewService;
exports.reviewService = new ReviewService();
