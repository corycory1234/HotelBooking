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
exports.hotelController = void 0;
const response_1 = require("../utils/response");
const hotel_service_1 = require("../services/hotel.service");
class HotelController {
    // 搜尋飯店列表
    getHotels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                if (!page || isNaN(page)) {
                    return res.status(400).json(response_1.ApiResponse.error("頁碼(page)為必填參數"));
                }
                // 處理價格參數
                const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : undefined;
                const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : undefined;
                // 驗證價格參數
                if (minPrice !== undefined && minPrice <= 0) {
                    return res.status(400).json(response_1.ApiResponse.error("最低價格必須大於 0"));
                }
                if (maxPrice !== undefined && maxPrice <= 0) {
                    return res.status(400).json(response_1.ApiResponse.error("最高價格必須大於 0"));
                }
                const searchParams = {
                    page,
                    limit: 10,
                    country: req.query.country || undefined,
                    city: req.query.city || undefined,
                    min_Price: minPrice,
                    max_Price: maxPrice,
                    ratings: req.query.ratings ?
                        req.query.ratings.split(',').map(r => parseFloat(r)).filter(r => !isNaN(r)) :
                        undefined,
                    search_Query: req.query.q || undefined,
                    facilities: req.query.facilities ?
                        req.query.facilities.split(',').filter(f => f.trim()) :
                        undefined,
                    bed_Types: req.query.bedTypes ?
                        req.query.bedTypes.split(',').filter(b => b.trim()) :
                        undefined
                };
                const results = yield hotel_service_1.hotelService.searchHotels(searchParams);
                res.json(response_1.ApiResponse.success(results));
            }
            catch (error) {
                console.error('Get hotels error:', error);
                res.status(500).json(response_1.ApiResponse.error(error instanceof Error ? error.message : '搜尋飯店失敗'));
            }
        });
    }
    // 獲取飯店詳情
    getHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const hotel = yield hotel_service_1.hotelService.getHotelDetails(id);
                res.json(response_1.ApiResponse.success(hotel));
            }
            catch (error) {
                console.error('Get hotel error:', error);
                if (error instanceof Error && 'code' in error) {
                    return res.status(error.code).json(response_1.ApiResponse.error(error.message));
                }
                res.status(500).json(response_1.ApiResponse.error(error instanceof Error ? error.message : '獲取飯店詳情失敗'));
            }
        });
    }
    // 新增飯店
    createHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                const hotelData = req.body;
                const validation = hotel_service_1.hotelService.validateHotelData(hotelData);
                if (!validation.isValid) {
                    return res.status(400).json(response_1.ApiResponse.error(validation.error || "資料格式不正確"));
                }
                const result = yield hotel_service_1.hotelService.createHotel(hotelData, token);
                res.status(201).json(response_1.ApiResponse.success(result));
            }
            catch (error) {
                console.error('Create hotel error:', error);
                res.status(500).json(response_1.ApiResponse.error("建立飯店失敗"));
            }
        });
    }
    // 上傳房型照片
    uploadRoomTypeImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                const { roomTypeId } = req.params;
                const files = req.files;
                if (!files || files.length === 0) {
                    return res.status(400).json(response_1.ApiResponse.error("請選擇要上傳的照片"));
                }
                const results = yield hotel_service_1.hotelService.uploadRoomTypeImages(roomTypeId, files, token);
                res.json(response_1.ApiResponse.success(results));
            }
            catch (error) {
                console.error('Upload error:', error);
                res.status(500).json(response_1.ApiResponse.error(error instanceof Error ? error.message : "上傳照片失敗"));
            }
        });
    }
    // 刪除飯店照片
    deleteHotelImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                const { hotelId } = req.params;
                const { imageUrls } = req.body;
                if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
                    return res.status(400).json(response_1.ApiResponse.error("請提供要刪除的照片 URL"));
                }
                yield hotel_service_1.hotelService.deleteHotelImages(hotelId, imageUrls, token);
                res.json(response_1.ApiResponse.success({ message: "照片刪除成功" }));
            }
            catch (error) {
                console.error('Delete images error:', error);
                res.status(500).json(response_1.ApiResponse.error(error instanceof Error ? error.message : "刪除照片失敗"));
            }
        });
    }
    // 刪除房型照片
    deleteRoomTypeImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                const { roomTypeId } = req.params;
                const { imageUrls } = req.body;
                if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
                    return res.status(400).json(response_1.ApiResponse.error("請提供要刪除的照片 URL"));
                }
                yield hotel_service_1.hotelService.deleteRoomTypeImages(roomTypeId, imageUrls, token);
                res.json(response_1.ApiResponse.success({ message: "照片刪除成功" }));
            }
            catch (error) {
                console.error('Delete images error:', error);
                res.status(500).json(response_1.ApiResponse.error(error instanceof Error ? error.message : "刪除照片失敗"));
            }
        });
    }
    // 刪除房型
    deleteRoomType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                const { roomTypeId } = req.params;
                const result = yield hotel_service_1.hotelService.deleteRoomType(roomTypeId, token);
                res.json(response_1.ApiResponse.success(result));
            }
            catch (error) {
                console.error('Delete room type error:', error);
                if (error instanceof Error && 'code' in error) {
                    return res.status(error.code).json(response_1.ApiResponse.error(error.message));
                }
                res.status(500).json(response_1.ApiResponse.error(error instanceof Error ? error.message : '刪除房型失敗'));
            }
        });
    }
    // 清理檔案名稱
    static cleanFileName(fileName) {
        return fileName
            .normalize('NFD') // 分解重音字符
            .replace(/[\u0300-\u036f]/g, '') // 移除重音符號
            .replace(/[^a-zA-Z0-9.-]/g, '-') // 替換特殊字元為連字符
            .replace(/-{2,}/g, '-') // 移除多餘的連字符
            .replace(/^-+|-+$/g, ''); // 移除開頭和結尾的連字符
    }
    // 上傳飯店照片
    uploadHotelImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
                const { hotelId } = req.params;
                const files = req.files;
                if (!files || files.length === 0) {
                    return res.status(400).json(response_1.ApiResponse.error("請選擇要上傳的照片"));
                }
                const results = yield hotel_service_1.hotelService.uploadHotelImages(hotelId, files, token);
                res.json(response_1.ApiResponse.success(results));
            }
            catch (error) {
                console.error('Upload error:', error);
                res.status(500).json(response_1.ApiResponse.error(error instanceof Error ? error.message : "上傳照片失敗"));
            }
        });
    }
}
exports.hotelController = new HotelController();
