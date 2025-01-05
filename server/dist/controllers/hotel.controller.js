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
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../utils/response");
class HotelController {
    // 搜尋飯店列表
    getHotels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allHotels = yield db_1.db.select().from(schema_1.hotels);
                res.json(response_1.ApiResponse.success(allHotels));
            }
            catch (error) {
                res.status(500).json(response_1.ApiResponse.error(error.message));
            }
        });
    }
    // 獲取飯店詳情
    getHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const hotel = yield db_1.db
                    .select()
                    .from(schema_1.hotels)
                    .where((0, drizzle_orm_1.eq)(schema_1.hotels.id, id));
                if (!hotel.length) {
                    return res
                        .status(404)
                        .json(response_1.ApiResponse.error("Hotel not found"));
                }
                res.json(response_1.ApiResponse.success(hotel[0]));
            }
            catch (error) {
                res.status(500).json(response_1.ApiResponse.error(error.message));
            }
        });
    }
    // 獲取飯店房型
    getHotelRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const hotelRooms = yield db_1.db
                    .select()
                    .from(schema_1.rooms)
                    .where((0, drizzle_orm_1.eq)(schema_1.rooms.hotelId, id));
                res.json(response_1.ApiResponse.success(hotelRooms));
            }
            catch (error) {
                res.status(500).json(response_1.ApiResponse.error(error.message));
            }
        });
    }
    // 新增飯店
    createHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, address, latitude, longitude, amenities, } = req.body;
                const newHotel = yield db_1.db
                    .insert(schema_1.hotels)
                    .values({
                    name,
                    description,
                    address,
                    latitude,
                    longitude,
                    amenities,
                })
                    .returning();
                res.status(201).json(response_1.ApiResponse.success(newHotel[0]));
            }
            catch (error) {
                res.status(500).json(response_1.ApiResponse.error(error.message));
            }
        });
    }
}
exports.hotelController = new HotelController();
