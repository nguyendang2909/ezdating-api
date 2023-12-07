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
exports.UpdateProfileFilterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const messages_1 = require("../../../commons/messages");
const constants_1 = require("../../../constants");
const utils_1 = require("../../../utils");
class UpdateProfileFilterDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, enum: constants_1.GENDERS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.GENDERS),
    __metadata("design:type", Number)
], UpdateProfileFilterDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateProfileFilterDto.prototype, "maxDistance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateProfileFilterDto.prototype, "minAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    (0, utils_1.IsBiggerOrEqual)('minAge', {
        message: messages_1.ERROR_MESSAGES['Max age must be larger than min age'],
    }),
    __metadata("design:type", Number)
], UpdateProfileFilterDto.prototype, "maxAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, enum: constants_1.RELATIONSHIP_GOALS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.RELATIONSHIP_GOALS),
    __metadata("design:type", Number)
], UpdateProfileFilterDto.prototype, "relationshipGoal", void 0);
exports.UpdateProfileFilterDto = UpdateProfileFilterDto;
//# sourceMappingURL=update-profile-filters.dto.js.map