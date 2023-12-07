"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const mongoose_1 = require("mongoose");
const app_config_1 = require("../../app.config");
const common_service_1 = require("./common.service");
class DbService extends common_service_1.CommonService {
    constructor() {
        super(...arguments);
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.DEFAULT;
    }
    getObjectId(id) {
        return new mongoose_1.Types.ObjectId(id);
    }
    getClient(client) {
        const { id: currentUserId } = client;
        const _currentUserId = this.getObjectId(currentUserId);
        return { currentUserId, _currentUserId };
    }
}
exports.DbService = DbService;
//# sourceMappingURL=db.service.js.map