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
exports.MatchesWriteService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const commons_1 = require("../../../commons");
const models_1 = require("../../models");
const matches_handler_1 = require("../matches.handler");
let MatchesWriteService = class MatchesWriteService extends commons_1.ApiWriteService {
    constructor(matchModel, profileModel, matchesHandler) {
        super();
        this.matchModel = matchModel;
        this.profileModel = profileModel;
        this.matchesHandler = matchesHandler;
    }
    async createOne(payload, clientData) {
        const { _currentUserId } = this.getClient(clientData);
        const { targetUserId } = payload;
        const _targetUserId = this.getObjectId(targetUserId);
        const { profileOne, profileTwo } = await this.profileModel.findTwoOrFailPublicByIds(_currentUserId, _targetUserId);
        await this.matchModel.findOneAndFail({
            'profileOne._id': profileOne._id,
            'profileTwo._id': profileTwo._id,
        });
        const createdMatch = await this.matchModel.createOne({
            profileOne,
            profileTwo,
        });
        this.matchesHandler.handleAfterCreateMatch({
            match: createdMatch,
            _currentUserId,
        });
        const restCreatedMatch = lodash_1.default.omit(createdMatch, ['profileOne', 'profileTwo']);
        return Object.assign(Object.assign({}, restCreatedMatch), { targetProfile: profileOne._id.toString() === targetUserId ? profileOne : profileTwo });
    }
    async unmatch(id, clientData) {
        const _id = this.getObjectId(id);
        const { id: currentUserId } = clientData;
        const _currentUserId = this.getObjectId(currentUserId);
        const existMatch = await this.matchModel.findOneOrFail({
            _id,
            $or: [
                { 'profileOne._id': _currentUserId },
                { 'profileTwo._id': _currentUserId },
            ],
        });
        await this.matchModel.deleteOneOrFail(Object.assign({ _id }, this.matchModel.queryUserOneOrUserTwo(_currentUserId)));
        this.matchesHandler.afterUnmatch({
            match: existMatch,
            currentUserId,
        });
        return {
            _id: existMatch._id,
        };
    }
};
MatchesWriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.MatchModel,
        models_1.ProfileModel,
        matches_handler_1.MatchesHandler])
], MatchesWriteService);
exports.MatchesWriteService = MatchesWriteService;
//# sourceMappingURL=matches-write.service.js.map