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
exports.ViewsWriteService = void 0;
const common_1 = require("@nestjs/common");
const commons_1 = require("../../../commons");
const messages_1 = require("../../../commons/messages");
const models_1 = require("../../models");
let ViewsWriteService = class ViewsWriteService extends commons_1.ApiWriteService {
    constructor(viewModel, profileModel, matchModel) {
        super();
        this.viewModel = viewModel;
        this.profileModel = profileModel;
        this.matchModel = matchModel;
    }
    async send(payload, clientData) {
        const { currentUserId, _currentUserId } = this.getClient(clientData);
        const { targetUserId } = payload;
        this.verifyNotSameUserById(currentUserId, targetUserId);
        const _targetUserId = this.getObjectId(targetUserId);
        await this.viewModel.findOneAndFail({
            'profile._id': _currentUserId,
            'targetProfile._id': _targetUserId,
        });
        const { profileOne, profileTwo } = await this.profileModel.findTwoOrFailPublicByIds(_currentUserId, _targetUserId);
        const isUserOne = this.matchModel.isUserOne({
            currentUserId,
            userOneId: profileOne._id.toString(),
        });
        const view = await this.viewModel.createOne({
            profile: isUserOne ? profileOne : profileTwo,
            targetProfile: isUserOne ? profileTwo : profileOne,
        });
        return view;
    }
    verifyNotSameUserById(userOne, userTwo) {
        if (userOne === userTwo) {
            throw new common_1.BadRequestException({
                message: messages_1.ERROR_MESSAGES['You cannot view yourself'],
            });
        }
    }
};
ViewsWriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ViewModel,
        models_1.ProfileModel,
        models_1.MatchModel])
], ViewsWriteService);
exports.ViewsWriteService = ViewsWriteService;
//# sourceMappingURL=views-write.service.js.map