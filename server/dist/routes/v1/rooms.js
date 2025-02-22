"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomBasicTypes_controller_1 = require("../../controllers/roomBasicTypes.controller");
const router = express_1.default.Router();
router.get("/types", roomBasicTypes_controller_1.getRoomBasicTypes);
exports.default = router;
