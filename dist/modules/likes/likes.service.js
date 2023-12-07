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
var LikesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const app_config_1 = require("../../app.config");
const error_messages_constant_1 = require("../../commons/messages/error-messages.constant");
const api_cursor_date_service_1 = require("../../commons/services/api-cursor-date.service");
const chats_gateway_1 = require("../chats/chats.gateway");
const models_1 = require("../models");
const match_model_1 = require("../models/match.model");
const view_model_1 = require("../models/view.model");
const likes_handler_1 = require("./likes.handler");
let LikesService = LikesService_1 = class LikesService extends api_cursor_date_service_1.ApiCursorDateService {
    constructor(chatsGateway, matchModel, viewModel, profileModel, likesHandler, profileFilterModel) {
        super();
        this.chatsGateway = chatsGateway;
        this.matchModel = matchModel;
        this.viewModel = viewModel;
        this.profileModel = profileModel;
        this.likesHandler = likesHandler;
        this.profileFilterModel = profileFilterModel;
        this.logger = new common_1.Logger(LikesService_1.name);
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.LIKES;
    }
    async send(payload, clientData) {
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
    async findManyLikedMe(queryParams, clientData) {
        const { id: currentUserId } = clientData;
        const _currentUserId = this.getObjectId(currentUserId);
        const { _next } = queryParams;
        const cursor = _next ? this.getCursor(_next) : undefined;
        const filterProfile = await this.profileFilterModel.findOneOrFail({
            _id: _currentUserId,
        });
        const findResults = await this.viewModel.findMany(Object.assign(Object.assign({ 'targetProfile._id': _currentUserId }, (cursor ? { createdAt: { $lt: cursor } } : {})), { 'profile.birthday': {
                $gte: (0, moment_1.default)().subtract(filterProfile.maxAge, 'years').toDate(),
                $lte: (0, moment_1.default)().subtract(filterProfile.minAge, 'years').toDate(),
            }, isLiked: true, isMatched: false, 'profile.gender': filterProfile.gender }), {}, {
            sort: { createdAt: -1 },
            limit: this.limitRecordsPerQuery,
        });
        return findResults;
    }
    async findOneLikeMeById(id, client) {
        const { _currentUserId } = this.getClient(client);
        const _id = this.getObjectId(id);
        const like = await this.viewModel.findOneOrFail([
            { $match: { _id, 'targetProfile._id': _currentUserId } },
        ]);
        return like;
    }
    getPagination(data) {
        return this.getPaginationByField(data, 'createdAt');
    }
    verifyNotSameUserById(userOne, userTwo) {
        if (userOne === userTwo) {
            throw new common_1.BadRequestException({
                message: error_messages_constant_1.ERROR_MESSAGES['You cannot like yourself'],
            });
        }
    }
};
LikesService = LikesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chats_gateway_1.ChatsGateway,
        match_model_1.MatchModel,
        view_model_1.ViewModel,
        models_1.ProfileModel,
        likes_handler_1.LikesHandler,
        models_1.ProfileFilterModel])
], LikesService);
exports.LikesService = LikesService;
//# sourceMappingURL=likes.service.js.map