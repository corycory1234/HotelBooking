"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const supabase_1 = require("../utils/supabase");
const db_1 = require("../db");
class BaseService {
    constructor() {
        this.supabase = supabase_1.supabase;
        this.db = db_1.db;
    }
}
exports.BaseService = BaseService;
