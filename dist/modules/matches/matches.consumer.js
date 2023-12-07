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
exports.MatchesConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const common_consumer_1 = require("../../commons/consumers/common.consumer");
const constants_1 = require("../../constants");
const models_1 = require("../models");
let MatchesConsumer = class MatchesConsumer extends common_consumer_1.CommonConsumer {
    constructor(messageModel) {
        super();
        this.messageModel = messageModel;
        this.logger = new common_1.Logger();
    }
    async handle({ data: { matchId } }) {
        try {
            await this.messageModel.deleteMany({
                _matchId: this.getObjectId(matchId),
            });
        }
        catch (err) { }
    }
};
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchesConsumer.prototype, "handle", null);
MatchesConsumer = __decorate([
    (0, bull_1.Processor)({ name: constants_1.BULL_QUEUE_EVENTS.MATCHES }),
    __metadata("design:paramtypes", [models_1.MessageModel])
], MatchesConsumer);
exports.MatchesConsumer = MatchesConsumer;
//# sourceMappingURL=matches.consumer.js.map