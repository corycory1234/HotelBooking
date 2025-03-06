import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { ApiResponse } from "../utils/response";
import { CreateReviewDTO } from "../types/review.types";

class ReviewController {
    // 新增評價
    async createReview(req: Request, res: Response) {
        try {
            const { bookingId } = req.params;
            const token = req.headers.authorization?.split(" ")[1] ?? "";
            const reviewData: CreateReviewDTO = {
                ...req.body,
                bookingId,
            };

            const validation = reviewService.validateReviewData(reviewData);
            if (!validation.isValid) {
                return res
                    .status(400)
                    .json(
                        ApiResponse.error(validation.error || "資料格式不正確")
                    );
            }

            const result = await reviewService.createReview(reviewData, token);
            res.status(201).json(ApiResponse.success(result));
        } catch (error) {
            console.error("Create review error:", error);
            if (error instanceof Error && "code" in error) {
                return res
                    .status((error as any).code)
                    .json(ApiResponse.error(error.message));
            }
            res.status(500).json(ApiResponse.error("新增評價失敗"));
        }
    }
}

export const reviewController = new ReviewController();
