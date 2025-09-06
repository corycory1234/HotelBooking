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
exports.getRoomBasicTypes = void 0;
const db_1 = require("../db");
const roomBasicTypes_1 = require("../db/schema/roomBasicTypes");
const getRoomBasicTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield db_1.db.select().from(roomBasicTypes_1.roomBasicTypes);
        res.status(200).json(types);
    }
    catch (error) {
        console.error("Error fetching room basic types:", error);
        res.status(500).json({
            message: "無法獲取房型資料",
            error: error instanceof Error ? error.message : "未知錯誤"
        });
    }
});
exports.getRoomBasicTypes = getRoomBasicTypes;
