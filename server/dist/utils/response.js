"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(data, status = 200) {
        return {
            status: "success",
            data,
        };
    }
    static error(message, status = 500) {
        return {
            status: "error",
            message,
        };
    }
}
exports.ApiResponse = ApiResponse;
