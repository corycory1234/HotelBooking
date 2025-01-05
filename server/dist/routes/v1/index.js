"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const hotels_1 = __importDefault(require("./hotels"));
const bookings_1 = __importDefault(require("./bookings"));
const reviews_1 = __importDefault(require("./reviews"));
require("dotenv/config");
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/hotels', hotels_1.default);
router.use('/bookings', bookings_1.default);
router.use('/reviews', reviews_1.default);
exports.default = router;
