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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
// import { hotelController } from '../../controllers/hotel.controller';
// import { authenticate } from '../../middlewares/auth';
const router = express_1.default.Router();
// 使用 async handler 包裝控制器方法
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// 搜尋飯店列表
// router.get('/', hotelController.getHotels);
// 獲取飯店詳情
// router.get('/:id', asyncHandler(hotelController.getHotel));
// 獲取飯店房型
router.get('/:id/rooms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: 實作房型列表邏輯
}));
// 需要認證的路由
// router.post('/', authenticate, hotelController.createHotel);
exports.default = router;
