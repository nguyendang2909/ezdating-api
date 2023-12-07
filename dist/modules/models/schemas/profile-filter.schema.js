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
exports.ProfileFilterSchema = exports.ProfileFilter = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const constants_1 = require("../../../constants");
let ProfileFilter = class ProfileFilter extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.GENDERS, required: true }),
    __metadata("design:type", Number)
], ProfileFilter.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], ProfileFilter.prototype, "maxDistance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], ProfileFilter.prototype, "maxAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], ProfileFilter.prototype, "minAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.RELATIONSHIP_GOALS }),
    __metadata("design:type", Number)
], ProfileFilter.prototype, "relationshipGoal", void 0);
ProfileFilter = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProfileFilter);
exports.ProfileFilter = ProfileFilter;
exports.ProfileFilterSchema = mongoose_1.SchemaFactory.createForClass(ProfileFilter);
//# sourceMappingURL=profile-filter.schema.js.map