"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonTokensService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../messages");
const common_service_1 = require("./common.service");
class CommonTokensService extends common_service_1.CommonService {
    constructor() {
        super();
        this.SECRET_KEY = '';
    }
    sign(payload) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
    signFromUser(user) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
    verify(token) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
}
exports.CommonTokensService = CommonTokensService;
//# sourceMappingURL=common-token.service.js.map