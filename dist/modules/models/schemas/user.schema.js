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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const constants_1 = require("../../../constants");
let User = class User extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "coins", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false, required: true }),
    __metadata("design:type", Boolean)
], User.prototype, "haveProfile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 300 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 20 }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        enum: constants_1.USER_ROLES,
        required: true,
        default: constants_1.USER_ROLES.MEMBER,
    }),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.USER_STATUSES, default: constants_1.USER_STATUSES.ACTIVATED }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 }, {
    unique: true,
    partialFilterExpression: {
        email: { $exists: true },
    },
});
exports.UserSchema.index({ phoneNumber: 1 }, {
    unique: true,
    partialFilterExpression: {
        phoneNumber: { $exists: true },
    },
});
exports.UserSchema.index({ facebookId: 1 }, {
    unique: true,
    partialFilterExpression: {
        facebookId: { $exists: true },
    },
});
//# sourceMappingURL=user.schema.js.map