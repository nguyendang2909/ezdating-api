"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesReadService = void 0;
const api_read_base_service_1 = require("../../../commons/services/api/api-read.base.service");
class ProfilesReadService extends api_read_base_service_1.ApiReadService {
    constructor(profileModel) {
        super();
        this.profileModel = profileModel;
    }
    async findOneById(id, _client) {
        const _id = this.getObjectId(id);
        const findResult = await this.profileModel.findOneOrFailById(_id);
        return findResult;
    }
}
exports.ProfilesReadService = ProfilesReadService;
//# sourceMappingURL=profiles-read.service.js.map