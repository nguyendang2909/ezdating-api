"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiReadService = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../../app.config");
const messages_1 = require("../../messages");
const api_base_service_1 = require("./api.base.service");
class ApiReadService extends api_base_service_1.ApiBaseService {
    constructor() {
        super(...arguments);
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.DEFAULT;
    }
    async findOneById(id, client) {
        return await this.throwNotImplemented();
    }
    async findMany(queryParams, client) {
        return await this.throwNotImplemented();
    }
    getPagination(data) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
}
exports.ApiReadService = ApiReadService;
//# sourceMappingURL=api-read.base.service.js.map