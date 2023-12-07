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
exports.MatchSchema = exports.Match = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const embedded_1 = require("./embedded");
const message_schema_1 = require("./message.schema");
let Match = class Match extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: embedded_1.EmbeddedProfileSchema, required: true }),
    __metadata("design:type", embedded_1.EmbeddedProfile)
], Match.prototype, "profileOne", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: embedded_1.EmbeddedProfileSchema, required: true }),
    __metadata("design:type", embedded_1.EmbeddedProfile)
], Match.prototype, "profileTwo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: message_schema_1.MessageSchema }),
    __metadata("design:type", message_schema_1.Message)
], Match.prototype, "lastMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Match.prototype, "userOneRead", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Match.prototype, "userTwoRead", void 0);
Match = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Match);
exports.Match = Match;
exports.MatchSchema = mongoose_1.SchemaFactory.createForClass(Match);
exports.MatchSchema.index({ 'profileOne._id': 1, 'profileTwo._id': 1 }, { unique: true });
exports.MatchSchema.index({
    'profileOne._id': 1,
    'profileTwo._id': 1,
    lastMessage: 1,
    createdAt: -1,
}, {
    partialFilterExpression: {
        lastMessage: { $exists: false },
    },
});
exports.MatchSchema.index({
    'profileOne._id': 1,
    'profileTwo._id': 1,
    'lastMessage.createdAt': -1,
});
//# sourceMappingURL=match.schema.js.map