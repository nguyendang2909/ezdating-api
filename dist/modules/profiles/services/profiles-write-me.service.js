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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesWriteMeService = void 0;
const common_1 = require("@nestjs/common");
const api_update_me_base_service_1 = require("../../../commons/services/api/api-update-me.base.service");
const utils_1 = require("../../../utils");
const models_1 = require("../../models");
let ProfilesWriteMeService = class ProfilesWriteMeService extends api_update_me_base_service_1.ApiWriteMeService {
    constructor(profileModel, stateModel, profilesUtil) {
        super(profileModel);
        this.profileModel = profileModel;
        this.stateModel = stateModel;
        this.profilesUtil = profilesUtil;
    }
    async updateOne(payload, client) {
        const { longitude, latitude, birthday: rawBirthday, stateId } = payload, updateDto = __rest(payload, ["longitude", "latitude", "birthday", "stateId"]);
        const { _currentUserId } = this.getClient(client);
        const updateOptions = {
            $set: Object.assign(Object.assign(Object.assign(Object.assign({}, updateDto), (rawBirthday
                ? { birthday: this.profilesUtil.verifyBirthdayFromRaw(rawBirthday) }
                : {})), (longitude && latitude
                ? {
                    geolocation: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                }
                : {})), (stateId
                ? {
                    state: await this.stateModel.findOneOrFailById(this.getObjectId(stateId)),
                }
                : {})),
        };
        await this.profileModel.updateOneById(_currentUserId, updateOptions);
    }
};
ProfilesWriteMeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.StateModel,
        utils_1.ProfilesUtil])
], ProfilesWriteMeService);
exports.ProfilesWriteMeService = ProfilesWriteMeService;
//# sourceMappingURL=profiles-write-me.service.js.map