"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiWriteService = void 0;
const api_base_service_1 = require("./api.base.service");
class ApiWriteService extends api_base_service_1.ApiBaseService {
    async createOne(payload, client) {
        return await this.throwNotImplemented();
    }
    async updateOneById(id, payload, client) {
        return await this.throwNotImplemented();
    }
}
exports.ApiWriteService = ApiWriteService;
//# sourceMappingURL=api-write.base.service.js.map