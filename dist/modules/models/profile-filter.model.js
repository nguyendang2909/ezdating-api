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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileFilterModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const app_config_1 = require("../../app.config");
const error_messages_constant_1 = require("../../commons/messages/error-messages.constant");
const constants_1 = require("../../constants");
const common_model_1 = require("./bases/common-model");
const profile_model_1 = require("./profile.model");
const schemas_1 = require("./schemas");
let ProfileFilterModel = class ProfileFilterModel extends common_model_1.CommonModel {
    constructor(model, profileModel) {
        super();
        this.model = model;
        this.profileModel = profileModel;
        this.conflictMessage = error_messages_constant_1.ERROR_MESSAGES['Profile filter already exists'];
        this.notFoundMessage = error_messages_constant_1.ERROR_MESSAGES['Profile filter does not exist'];
    }
    async createOne(doc) {
        const createResult = await this.model.create(doc);
        return createResult.toJSON();
    }
    async createOneFromProfile(profile) {
        const age = this.profileModel.getAgeFromBirthday(profile.birthday);
        return await this.createOne({
            _id: profile._id,
            gender: this.getFilterGender(profile.gender),
            minAge: age - 10 > 18 ? age - 10 : 18,
            maxAge: age + 10 < 100 ? age + 10 : 100,
            maxDistance: app_config_1.APP_CONFIG.USER_FILTER_MAX_DISTANCE,
        });
    }
    async findOneOrFail(filter, projection, options) {
        const existProfileFilter = await this.findOne(filter, projection, options);
        if (existProfileFilter) {
            return existProfileFilter;
        }
        if (!filter._id) {
            throw new common_1.NotFoundException(this.notFoundMessage);
        }
        const profile = await this.profileModel.findOneOrFailById(filter._id);
        const profileFilter = await this.createOneFromProfile(profile);
        return profileFilter;
    }
    getFilterGender(gender) {
        return gender === constants_1.GENDERS.MALE ? constants_1.GENDERS.FEMALE : constants_1.GENDERS.MALE;
    }
};
ProfileFilterModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schemas_1.ProfileFilter.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        profile_model_1.ProfileModel])
], ProfileFilterModel);
exports.ProfileFilterModel = ProfileFilterModel;
//# sourceMappingURL=profile-filter.model.js.map