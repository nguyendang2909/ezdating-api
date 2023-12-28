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
exports.LikesWriteService = void 0;
const common_1 = require("@nestjs/common");
const commons_1 = require("../../../commons");
const messages_1 = require("../../../commons/messages");
const models_1 = require("../../models");
const likes_handler_1 = require("../likes.handler");
let LikesWriteService = class LikesWriteService extends commons_1.ApiWriteService {
    constructor(matchModel, viewModel, profileModel, likesHandler) {
        super();
        this.matchModel = matchModel;
        this.viewModel = viewModel;
        this.profileModel = profileModel;
        this.likesHandler = likesHandler;
    }
    async createOne(payload, clientData) {
        const { targetUserId } = payload;
        const { _currentUserId, currentUserId } = this.getClient(clientData);
        this.verifyNotSameUserById(currentUserId, targetUserId);
        const _targetUserId = this.getObjectId(targetUserId);
        const { profileOne, profileTwo } = await this.profileModel.findTwoOrFailPublicByIds(_currentUserId, _targetUserId);
        await this.viewModel.findOneAndFail({
            'profile._id': _currentUserId,
            'targetProfile._id': _targetUserId,
            isLiked: true,
        });
        const reverseLike = await this.viewModel.findOneAndUpdate({
            'profile._id': _targetUserId,
            'targetProfile._id': _currentUserId,
            isLiked: true,
        }, { $set: { isMatched: true } });
        const isUserOne = this.matchModel.isUserOne({
            currentUserId,
            userOneId: profileOne._id.toString(),
        });
        const view = await this.viewModel.findOneAndUpdate({
            'profile._id': _targetUserId,
            'targetProfile._id': _currentUserId,
        }, {
            $set: Object.assign({ profile: isUserOne ? profileOne : profileTwo, targetProfile: isUserOne ? profileTwo : profileOne, isLiked: true }, (reverseLike ? { isMatched: true } : {})),
        }, { upsert: true, new: true });
        if (!view) {
            throw new common_1.InternalServerErrorException();
        }
        this.likesHandler.afterSendLike({
            hasReverseLike: !!reverseLike,
            profileOne,
            profileTwo,
            currentUserId,
        });
        return view;
    }
    verifyNotSameUserById(userOne, userTwo) {
        if (userOne === userTwo) {
            throw new common_1.BadRequestException({
                message: messages_1.ERROR_MESSAGES['You cannot like yourself'],
            });
        }
    }
};
LikesWriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.MatchModel,
        models_1.ViewModel,
        models_1.ProfileModel,
        likes_handler_1.LikesHandler])
], LikesWriteService);
exports.LikesWriteService = LikesWriteService;
//# sourceMappingURL=likes-write.service.js.map