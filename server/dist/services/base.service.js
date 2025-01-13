"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const db_1 = require("../db");
class BaseService {
    constructor() {
        this.db = db_1.db;
        this.supabase = db_1.supabase;
    }
}
exports.BaseService = BaseService;
