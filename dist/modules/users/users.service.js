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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const api_service_1 = require("../../commons/services/api.service");
const models_1 = require("../models");
const user_model_1 = require("../models/user.model");
let UsersService = class UsersService extends api_service_1.ApiService {
    constructor(userModel, profileModel) {
        super();
        this.userModel = userModel;
        this.profileModel = profileModel;
    }
    async findMe(client) {
        const { _currentUserId } = this.getClient(client);
        const user = await this.userModel.findOneOrFailById(_currentUserId);
        return lodash_1.default.omit(user, ['password']);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_model_1.UserModel,
        models_1.ProfileModel])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map