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
const router = express_1.default.Router();
// 建立訂單
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: 實作建立訂單邏輯
}));
// 獲取訂單列表
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: 實作訂單列表邏輯
}));
// 獲取訂單詳情
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: 實作訂單詳情邏輯
}));
// 取消訂單
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: 實作取消訂單邏輯
}));
exports.default = router;
