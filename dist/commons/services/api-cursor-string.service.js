"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCursorStringService = void 0;
const api_service_1 = require("./api.service");
class ApiCursorStringService extends api_service_1.ApiService {
    getCursor(_cursor) {
        const cursor = this.decodeToString(_cursor);
        return cursor;
    }
}
exports.ApiCursorStringService = ApiCursorStringService;
//# sourceMappingURL=api-cursor-string.service.js.map