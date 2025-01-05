export class ApiResponse {
    static success<T>(data: T, status = 200) {
        return {
            status: "success",
            data,
        };
    }

    static error(message: string, status = 500) {
        return {
            status: "error",
            message,
        };
    }
}
