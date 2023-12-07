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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ApiScript_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiScript = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../../constants");
const fe_constants_1 = require("../../constants/fe.constants");
const models_1 = require("../models");
const profiles_common_service_1 = require("../profiles/profiles.common.service");
let ApiScript = ApiScript_1 = class ApiScript extends profiles_common_service_1.ProfilesCommonService {
    constructor(profileModel, userModel) {
        super();
        this.profileModel = profileModel;
        this.userModel = userModel;
        this.logger = new common_1.Logger(ApiScript_1.name);
        this.api = axios_1.default.create({
            baseURL: this.baseUrl,
        });
        this.baseUrl = `${process.env.NODE_ENV === 'development' ? 'https' : 'http'}://localhost:${process.env.API_PORT}`;
    }
    init(accessToken) {
        this.api = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return this.api;
    }
    async createProfile(options) {
        const { data } = await this.api.post('/profiles/me/basic', {
            birthday: (0, moment_1.default)(faker_1.faker.date.between({
                from: (0, moment_1.default)().subtract(30, 'years').toDate(),
                to: (0, moment_1.default)().subtract(25, 'years').toDate(),
            })).format('YYYY-MM-DD'),
            gender: (options === null || options === void 0 ? void 0 : options.gender) || constants_1.GENDERS.FEMALE,
            introduce: faker_1.faker.word.words(),
            nickname: faker_1.faker.person.fullName(),
            relationshipGoal: faker_1.faker.number.int({
                min: 1,
                max: 5,
            }),
            stateId: '65574d3c942d1c7185fb339d',
        });
        return data;
    }
    async updateProfile() {
        const updateData = {
            company: faker_1.faker.company.name(),
            educationLevel: faker_1.faker.number.int({
                min: 1,
                max: 7,
            }),
            height: faker_1.faker.number.int({ min: 140, max: 180 }),
            hideAge: false,
            hideDistance: false,
            jobTitle: faker_1.faker.name.jobTitle(),
            languages: [faker_1.faker.location.country()],
            latitude: faker_1.faker.location.latitude(),
            longitude: faker_1.faker.location.longitude(),
            relationshipStatus: faker_1.faker.number.int({
                min: 1,
                max: 6,
            }),
            school: faker_1.faker.company.name(),
            weight: faker_1.faker.number.int({ min: 40, max: 100 }),
        };
        await this.api.patch('/profiles/me', updateData);
    }
    async sendLike(body) {
        return await this.api.post(fe_constants_1.API_ENDPOINTS.LIKES, body);
    }
};
ApiScript = ApiScript_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.UserModel])
], ApiScript);
exports.ApiScript = ApiScript;
//# sourceMappingURL=api.script.js.map