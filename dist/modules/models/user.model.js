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
var UserModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const error_messages_constant_1 = require("../../commons/messages/error-messages.constant");
const constants_1 = require("../../constants");
const common_model_1 = require("./bases/common-model");
const user_schema_1 = require("./schemas/user.schema");
let UserModel = UserModel_1 = class UserModel extends common_model_1.CommonModel {
    constructor(model) {
        super();
        this.model = model;
        this.logger = new common_1.Logger(UserModel_1.name);
        this.conflictMessage = error_messages_constant_1.ERROR_MESSAGES['User already exists'];
        this.notFoundMessage = error_messages_constant_1.ERROR_MESSAGES['User does not exist'];
    }
    async createOne(doc) {
        this.logger.log(`Create user with ${JSON.stringify(doc)}`);
        this.verifySignInPayload(doc);
        return await this.create(doc);
    }
    async create(doc) {
        const createResult = await this.model.create(doc);
        return createResult.toJSON();
    }
    async findOneOrFail(filter, projection, options) {
        const findResult = await this.findOne(filter, projection, options);
        if (!findResult) {
            throw new common_1.NotFoundException({
                message: error_messages_constant_1.ERROR_MESSAGES['User does not exist'],
            });
        }
        if (findResult.status === constants_1.USER_STATUSES.BANNED) {
            throw new common_1.BadRequestException({
                message: 'User has been banned',
            });
        }
        return findResult;
    }
    async findOneOrFailById(_id, projection, options) {
        return await this.findOneOrFail({ _id }, projection, options);
    }
    async findOneOrCreate(payload) {
        this.verifySignInPayload(payload);
        const user = await this.model.findOne(payload);
        if (user) {
            return this.verifyValid(user);
        }
        return await this.create(payload);
    }
    verifyValid(user) {
        if (user.status === constants_1.USER_STATUSES.BANNED) {
            throw new common_1.BadRequestException({
                message: 'User has been banned',
            });
        }
        return user;
    }
    verifySignInPayload(payload) {
        if (!payload.phoneNumber && !payload.email && !payload.facebookId) {
            throw new common_1.BadRequestException(error_messages_constant_1.ERROR_MESSAGES['You should sign in by phone number, google or facebook']);
        }
        return payload;
    }
};
UserModel = UserModel_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map