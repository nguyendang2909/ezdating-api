"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiBaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = __importDefault(require("mongoose"));
const messages_1 = require("../../messages");
const common_service_1 = require("../common.service");
class ApiBaseService extends common_service_1.CommonService {
    getObjectId(id) {
        return new mongoose_1.default.Types.ObjectId(id);
    }
    getClient(client) {
        const { id: currentUserId } = client;
        const _currentUserId = this.getObjectId(currentUserId);
        return { currentUserId, _currentUserId };
    }
    throwNotImplemented() {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
}
exports.ApiBaseService = ApiBaseService;
//# sourceMappingURL=api.base.service.js.map