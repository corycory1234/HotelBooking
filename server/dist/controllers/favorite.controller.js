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
exports.removeFavorite = exports.addFavorite = exports.getFavorites = void 0;
const favorite_service_1 = require("../services/favorite.service");
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "未登入",
            });
            return;
        }
        const favorites = yield favorite_service_1.favoriteService.getFavorites(req.user.id);
        res.status(200).json(favorites);
    }
    catch (error) {
        const status = error.code || 500;
        res.status(status).json({
            status: "error",
            message: error.message || "獲取最愛清單失敗",
        });
    }
});
exports.getFavorites = getFavorites;
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "未登入",
            });
            return;
        }
        const result = yield favorite_service_1.favoriteService.addFavorite(req.user.id, req.params.hotelId);
        res.status(200).json(result);
    }
    catch (error) {
        const status = error.code || 500;
        res.status(status).json({
            status: "error",
            message: error.message || "加入最愛失敗",
        });
    }
});
exports.addFavorite = addFavorite;
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "未登入",
            });
            return;
        }
        const result = yield favorite_service_1.favoriteService.removeFavorite(req.user.id, req.params.hotelId);
        res.status(200).json(result);
    }
    catch (error) {
        const status = error.code || 500;
        res.status(status).json({
            status: "error",
            message: error.message || "移除最愛失敗",
        });
    }
});
exports.removeFavorite = removeFavorite;
