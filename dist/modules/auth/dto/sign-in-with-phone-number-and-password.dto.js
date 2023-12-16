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
exports.SignInWithPhoneNumberAndPasswordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sign_in_dto_1 = require("./sign-in.dto");
class SignInWithPhoneNumberAndPasswordDto extends sign_in_dto_1.SignInDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, default: '+84971016191' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignInWithPhoneNumberAndPasswordDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, default: 'Onlyone2@' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignInWithPhoneNumberAndPasswordDto.prototype, "password", void 0);
exports.SignInWithPhoneNumberAndPasswordDto = SignInWithPhoneNumberAndPasswordDto;
//# sourceMappingURL=sign-in-with-phone-number-and-password.dto.js.map