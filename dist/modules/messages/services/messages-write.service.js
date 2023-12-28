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
exports.MessagesWriteService = void 0;
const common_1 = require("@nestjs/common");
const commons_1 = require("../../../commons");
const match_model_1 = require("../../models/match.model");
let MessagesWriteService = class MessagesWriteService extends commons_1.ApiBaseService {
    constructor(matchModel) {
        super();
        this.matchModel = matchModel;
    }
    async read(payload, client) {
        const { _currentUserId } = this.getClient(client);
        await this.matchModel.updateOne({
            _id: this.getObjectId(payload.matchId),
            lastMessage: {
                _id: this.getObjectId(payload.lastMessageId),
            },
            $or: [
                { _userOneId: _currentUserId, userOneRead: false },
                { _userOneId: _currentUserId, userTwoRead: false },
            ],
        }, {
            $set: {
                userOneRead: true,
                userTwoRead: true,
            },
        });
    }
};
MessagesWriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel])
], MessagesWriteService);
exports.MessagesWriteService = MessagesWriteService;
//# sourceMappingURL=messages-write.service.js.map