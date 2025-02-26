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
exports.reviewController = void 0;
const review_service_1 = require("../services/review.service");
const response_1 = require("../utils/response");
class ReviewController {
    // 新增評價
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { bookingId } = req.params;
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                const reviewData = Object.assign(Object.assign({}, req.body), { bookingId });
                const validation = review_service_1.reviewService.validateReviewData(reviewData);
                if (!validation.isValid) {
                    return res
                        .status(400)
                        .json(response_1.ApiResponse.error(validation.error || "資料格式不正確"));
                }
                const result = yield review_service_1.reviewService.createReview(reviewData, token);
                res.status(201).json(response_1.ApiResponse.success(result));
            }
            catch (error) {
                console.error("Create review error:", error);
                if (error instanceof Error && "code" in error) {
                    return res
                        .status(error.code)
                        .json(response_1.ApiResponse.error(error.message));
                }
                res.status(500).json(response_1.ApiResponse.error("新增評價失敗"));
            }
        });
    }
}
exports.reviewController = new ReviewController();
