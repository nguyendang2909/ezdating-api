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
exports.ProfileFiltersService = void 0;
const common_1 = require("@nestjs/common");
const commons_1 = require("../../commons");
const models_1 = require("../models");
let ProfileFiltersService = class ProfileFiltersService extends commons_1.ApiService {
    constructor(profileFilterModel) {
        super();
        this.profileFilterModel = profileFilterModel;
    }
    async updateMe(payload, client) {
        const { _currentUserId } = this.getClient(client);
        await this.profileFilterModel.updateOneById(_currentUserId, payload);
    }
    async getMe(client) {
        const { _currentUserId } = this.getClient(client);
        const findResult = await this.profileFilterModel.findOneOrFailById(_currentUserId);
        return findResult;
    }
};
ProfileFiltersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileFilterModel])
], ProfileFiltersService);
exports.ProfileFiltersService = ProfileFiltersService;
//# sourceMappingURL=profile-filters.service.js.map