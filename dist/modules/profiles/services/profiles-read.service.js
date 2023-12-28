"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesReadService = void 0;
const common_1 = require("@nestjs/common");
const api_read_base_service_1 = require("../../../commons/services/api/api-read.base.service");
const models_1 = require("../../models");
let ProfilesReadService = class ProfilesReadService extends api_read_base_service_1.ApiReadService {
    constructor(profileModel) {
        super();
        this.profileModel = profileModel;
    }
    async findOneById(id, _client) {
        const _id = this.getObjectId(id);
        const findResult = await this.profileModel.findOneOrFailById(_id);
        return findResult;
    }
};
ProfilesReadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel])
], ProfilesReadService);
exports.ProfilesReadService = ProfilesReadService;
//# sourceMappingURL=profiles-read.service.js.map