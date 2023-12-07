"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCursorObjectIdService = void 0;
const api_service_1 = require("./api.service");
class ApiCursorObjectIdService extends api_service_1.ApiService {
    getCursor(_cursor) {
        return this.getObjectId(this.decodeToString(_cursor));
    }
}
exports.ApiCursorObjectIdService = ApiCursorObjectIdService;
//# sourceMappingURL=api-cursor-object-id.service.js.map