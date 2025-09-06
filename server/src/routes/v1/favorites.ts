import { Router } from "express";
import {
    addFavorite,
    removeFavorite,
    getFavorites,
} from "../../controllers/favorite.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getFavorites);
router.post("/:hotelId", authMiddleware, addFavorite);
router.delete("/:hotelId", authMiddleware, removeFavorite);

export default router;
