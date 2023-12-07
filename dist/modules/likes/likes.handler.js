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
var LikesHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesHandler = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const commons_1 = require("../../commons");
const constants_1 = require("../../constants");
const chats_gateway_1 = require("../chats/chats.gateway");
const models_1 = require("../models");
const match_model_1 = require("../models/match.model");
const view_model_1 = require("../models/view.model");
const push_notifications_service_1 = require("../push-notifications/push-notifications.service");
let LikesHandler = LikesHandler_1 = class LikesHandler extends commons_1.DbService {
    constructor(chatsGateway, matchModel, viewModel, profileModel, pushNotificationsService) {
        super();
        this.chatsGateway = chatsGateway;
        this.matchModel = matchModel;
        this.viewModel = viewModel;
        this.profileModel = profileModel;
        this.pushNotificationsService = pushNotificationsService;
        this.logger = new common_1.Logger(LikesHandler_1.name);
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.LIKES;
    }
    async afterSendLike({ hasReverseLike, profileOne, profileTwo, currentUserId, }) {
        if (hasReverseLike) {
            const createdMatch = await this.matchModel.createOne({
                profileOne,
                profileTwo,
            });
            this.emitMatchToUser(profileOne._id.toString(), this.matchModel.formatOneWithTargetProfile(createdMatch, true));
            this.emitMatchToUser(profileTwo._id.toString(), this.matchModel.formatOneWithTargetProfile(createdMatch, false));
            const isUserOne = this.matchModel.isUserOne({
                currentUserId,
                userOneId: profileOne._id.toString(),
            });
            const currentProfile = isUserOne ? profileOne : profileTwo;
            const targetProfile = isUserOne ? profileTwo : profileOne;
            this.pushNotificationsService.sendByProfile(targetProfile, {
                content: `You have match with ${currentProfile.nickname}`,
                title: app_config_1.APP_CONFIG.APP_TITLE,
            });
        }
    }
    emitMatchToUser(userId, payload) {
        this.logger.log(`SOCKET_EVENT Emit "${constants_1.SOCKET_TO_CLIENT_EVENTS.MATCH}" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`);
        this.chatsGateway.server
            .to(userId)
            .emit(constants_1.SOCKET_TO_CLIENT_EVENTS.MATCH, payload);
    }
};
LikesHandler = LikesHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chats_gateway_1.ChatsGateway,
        match_model_1.MatchModel,
        view_model_1.ViewModel,
        models_1.ProfileModel,
        push_notifications_service_1.PushNotificationsService])
], LikesHandler);
exports.LikesHandler = LikesHandler;
//# sourceMappingURL=likes.handler.js.map