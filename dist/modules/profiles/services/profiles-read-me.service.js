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
exports.ProfilesReadMeService = void 0;
const common_1 = require("@nestjs/common");
const api_read_me_base_service_1 = require("../../../commons/services/api/api-read-me.base.service");
const models_1 = require("../../models");
let ProfilesReadMeService = class ProfilesReadMeService extends api_read_me_base_service_1.ApiReadMeService {
    constructor(profileModel, basicProfileModel) {
        super();
        this.profileModel = profileModel;
        this.basicProfileModel = basicProfileModel;
    }
    async findOne(client) {
        const { id: currentUserId } = client;
        const _currentUserId = this.getObjectId(currentUserId);
        const profile = await this.profileModel.findOneById(_currentUserId);
        if (!profile) {
            return await this.basicProfileModel.findOneOrFailById(_currentUserId);
        }
        return profile;
    }
};
ProfilesReadMeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.BasicProfileModel])
], ProfilesReadMeService);
exports.ProfilesReadMeService = ProfilesReadMeService;
//# sourceMappingURL=profiles-read-me.service.js.map