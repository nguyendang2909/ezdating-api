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
var MatchesHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesHandler = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../../constants");
const chats_gateway_1 = require("../chats/chats.gateway");
const models_1 = require("../models");
const match_model_1 = require("../models/match.model");
let MatchesHandler = MatchesHandler_1 = class MatchesHandler {
    constructor(matchModel, chatsGateway, profileModel, viewModel, trashMatchModel) {
        this.matchModel = matchModel;
        this.chatsGateway = chatsGateway;
        this.profileModel = profileModel;
        this.viewModel = viewModel;
        this.trashMatchModel = trashMatchModel;
        this.logger = new common_1.Logger(MatchesHandler_1.name);
    }
    async afterUnmatch({ currentUserId, match, }) {
        const _currentUserId = new mongoose_1.default.Types.ObjectId(currentUserId);
        const { profileOne, profileTwo } = match;
        const userOneId = profileOne._id.toString();
        const userTwoId = profileTwo._id.toString();
        this.emitUnMatchToUser(userOneId, { _id: match._id });
        this.emitUnMatchToUser(userTwoId, { _id: match._id });
        await this.trashMatchModel.createOne(match);
        const { _targetUserId } = this.matchModel.getTargetUserId({
            currentUserId,
            userOneId,
            userTwoId,
        });
        await this.viewModel
            .findOneAndUpdate({
            'profile._id': _currentUserId,
            'targetProfile._id': _targetUserId,
        }, {
            $set: {
                isLiked: false,
                isMatched: false,
            },
        })
            .catch((error) => {
            this.logger.error(`Failed to update like after unmatch  error: ${JSON.stringify(error)}`);
        });
        await this.viewModel
            .updateOne({ 'profile._id': _targetUserId, 'targetProfile._id': _currentUserId }, { $set: { isMatched: false } })
            .catch((error) => {
            this.logger.error(`Failed to update like from other to unmatch: ${JSON.stringify(error)}`);
        });
    }
    emitMatchToUser(userId, payload) {
        this.logger.log(`SOCKET_EVENT Emit "${constants_1.SOCKET_TO_CLIENT_EVENTS.MATCH}" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`);
        this.chatsGateway.server
            .to(userId)
            .emit(constants_1.SOCKET_TO_CLIENT_EVENTS.MATCH, payload);
    }
    emitUnMatchToUser(userId, payload) {
        this.logger.log(`SOCKET_EVENT Emit "${constants_1.SOCKET_TO_CLIENT_EVENTS.UNMATCH}" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`);
        this.chatsGateway.server
            .to(userId)
            .emit(constants_1.SOCKET_TO_CLIENT_EVENTS.UNMATCH, payload);
    }
    async handleAfterCreateMatch({ match, _currentUserId, }) {
        this.emitMatchToUser(match.profileOne._id.toString(), this.matchModel.formatOneWithTargetProfile(match, true));
        this.emitMatchToUser(match.profileTwo._id.toString(), this.matchModel.formatOneWithTargetProfile(match, false));
    }
    async afterFindOneMatch({ match, profileOne, profileTwo, }) {
        await this.profileModel.updateOneById(match._id, {
            profileOne,
            profileTwo,
        });
    }
};
MatchesHandler = MatchesHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel,
        chats_gateway_1.ChatsGateway,
        models_1.ProfileModel,
        models_1.ViewModel,
        models_1.TrashMatchModel])
], MatchesHandler);
exports.MatchesHandler = MatchesHandler;
//# sourceMappingURL=matches.handler.js.map