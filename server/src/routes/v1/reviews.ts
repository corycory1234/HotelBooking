import express from "express";
import { reviewController } from "../../controllers/review.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

const asyncHandler =
    (fn: Function) =>
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// 新增評價 (使用訂單 ID)
router.post(
    "/:bookingId",
    authMiddleware,
    asyncHandler(reviewController.createReview)
);

export default router;
