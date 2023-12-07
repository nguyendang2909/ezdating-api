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
exports.ViewSchema = exports.View = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const embedded_1 = require("./embedded");
let View = class View extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: embedded_1.EmbeddedProfileSchema, required: true }),
    __metadata("design:type", embedded_1.EmbeddedProfile)
], View.prototype, "profile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: embedded_1.EmbeddedProfileSchema, required: true }),
    __metadata("design:type", embedded_1.EmbeddedProfile)
], View.prototype, "targetProfile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: false, default: false }),
    __metadata("design:type", Boolean)
], View.prototype, "isLiked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: false, default: false }),
    __metadata("design:type", Boolean)
], View.prototype, "isMatched", void 0);
View = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], View);
exports.View = View;
exports.ViewSchema = mongoose_1.SchemaFactory.createForClass(View);
exports.ViewSchema.index({ 'profile._id': 1, 'targetProfile._id': 1 }, { unique: true });
exports.ViewSchema.index({ 'profile._id': 1, isMatched: 1, isLiked: 1, createdAt: 1 }, {
    partialFilterExpression: {
        isMatched: { $eq: false },
        isLiked: { $eq: false },
    },
});
exports.ViewSchema.index({
    'profile._id': 1,
    'targetProfile.state._id': 1,
    isMatched: 1,
    isLiked: 1,
    createdAt: 1,
});
exports.ViewSchema.index({
    'targetProfile._id': 1,
    createdAt: 1,
    'profile.birthday': 1,
    isLiked: 1,
    isMatched: 1,
    'profile.gender': 1,
});
//# sourceMappingURL=view.schema.js.map