"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCursorDateService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const messages_1 = require("../messages");
const api_service_1 = require("./api.service");
class ApiCursorDateService extends api_service_1.ApiService {
    getCursor(_cursor) {
        const cursor = (0, moment_1.default)(this.decodeToString(_cursor));
        if (!cursor.isValid()) {
            throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['Input data was not correct']);
        }
        return cursor.toDate();
    }
}
exports.ApiCursorDateService = ApiCursorDateService;
//# sourceMappingURL=api-cursor-date.service.js.map