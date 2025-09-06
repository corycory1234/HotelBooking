import { Request, Response } from "express";
import { favoriteService } from "../services/favorite.service";

export const getFavorites = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "未登入",
            });
            return;
        }
        const favorites = await favoriteService.getFavorites(req.user.id);
        res.status(200).json(favorites);
    } catch (error: any) {
        const status = error.code || 500;
        res.status(status).json({
            status: "error",
            message: error.message || "獲取最愛清單失敗",
        });
    }
};

export const addFavorite = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "未登入",
            });
            return;
        }
        const result = await favoriteService.addFavorite(
            req.user.id,
            req.params.hotelId
        );
        res.status(200).json(result);
    } catch (error: any) {
        const status = error.code || 500;
        res.status(status).json({
            status: "error",
            message: error.message || "加入最愛失敗",
        });
    }
};

export const removeFavorite = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "未登入",
            });
            return;
        }
        const result = await favoriteService.removeFavorite(
            req.user.id,
            req.params.hotelId
        );
        res.status(200).json(result);
    } catch (error: any) {
        const status = error.code || 500;
        res.status(status).json({
            status: "error",
            message: error.message || "移除最愛失敗",
        });
    }
};
