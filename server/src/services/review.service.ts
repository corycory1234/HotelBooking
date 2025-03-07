import { BaseService } from "./base.service";
import { db } from "../db";
import { hotels } from "../db/schema";
import { bookings } from "../db/schema/bookings";
import { CreateReviewDTO } from "../types/review.types";
import { eq, and } from "drizzle-orm";

class ReviewServiceError extends Error {
    constructor(message: string, public code: number = 500) {
        super(message);
        this.name = "ReviewServiceError";
    }
}

export class ReviewService extends BaseService {
    // 新增一個私有方法來標準化評論格式
    private standardizeReview(review: any) {
        return {
            traveler_Id: review.traveler_Id || review.travelerId,
            traveler_Name: review.traveler_Name || review.travelerName,
            traveler_Rating: review.traveler_Rating || review.travelerRating,
            comment: review.comment,
            date: review.date,
            reply: review.reply,
        };
    }

    async createReview(reviewData: CreateReviewDTO, token: string) {
        try {
            if (!token) {
                throw new ReviewServiceError("未提供認證信息", 401);
            }

            const {
                data: { user },
                error: authError,
            } = await this.supabase.auth.getUser(token);
            if (authError || !user) {
                throw new ReviewServiceError("無效的認證信息", 401);
            }

            // 查詢訂單資訊
            const booking = await db
                .select()
                .from(bookings)
                .where(
                    and(
                        eq(bookings.id, reviewData.bookingId),
                        eq(bookings.userId, user.id)
                    )
                )
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
            const hotel = await db
                .select()
                .from(hotels)
                .where(eq(hotels.hotel_Id, booking.hotelId))
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
            await db
                .update(bookings)
                .set({
                    review: reviewData.comment,
                    starRating: reviewData.rating,
                    updatedAt: new Date(),
                })
                .where(eq(bookings.id, reviewData.bookingId));

            // 更新飯店的評價列表
            const currentReviews = (hotel.review_List || []).map((review) =>
                this.standardizeReview(review)
            );
            const updatedReviews = [...currentReviews, newReview];

            // 計算新的平均評分
            const totalRating =
                updatedReviews.reduce(
                    (sum, review) => sum + review.traveler_Rating,
                    0
                ) / updatedReviews.length;

            // 更新飯店資料
            await db
                .update(hotels)
                .set({
                    review_List: updatedReviews,
                    totalRating: totalRating.toString(),
                    updatedAt: new Date(),
                })
                .where(eq(hotels.hotel_Id, booking.hotelId));

            return newReview;
        } catch (error) {
            console.error("Create review error:", error);
            if (error instanceof ReviewServiceError) {
                throw error;
            }
            throw new ReviewServiceError(
                error instanceof Error ? error.message : "新增評價失敗",
                500
            );
        }
    }

    validateReviewData(data: CreateReviewDTO): {
        isValid: boolean;
        error?: string;
    } {
        if (!data.bookingId) {
            return { isValid: false, error: "訂單ID為必填" };
        }
        if (data.rating === undefined || data.rating < 1 || data.rating > 5) {
            return { isValid: false, error: "評分必須介於 1-5 之間" };
        }
        if (!data.comment?.trim()) {
            return { isValid: false, error: "評論內容為必填" };
        }
        return { isValid: true };
    }
}

export const reviewService = new ReviewService();
