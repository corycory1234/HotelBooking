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
exports.authController = void 0;
const db_1 = require("../db");
exports.authController = {
    // 註冊
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name } = req.body;
                const { data, error } = yield db_1.supabase.auth.signUp({
                    email,
                    password,
                });
                if (error)
                    throw error;
                res.status(201).json({
                    status: "success",
                    data,
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
    },
    // 登入
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { data, error } = yield db_1.supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error)
                    throw error;
                res.json({
                    status: "success",
                    data,
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
    },
};
