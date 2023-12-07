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
exports.SignedDeviceSchema = exports.SignedDevice = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const constants_1 = require("../../../constants");
let SignedDevice = class SignedDevice extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SignedDevice.prototype, "_userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SignedDevice.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], SignedDevice.prototype, "expiresIn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SignedDevice.prototype, "token", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.DEVICE_PLATFORMS }),
    __metadata("design:type", Number)
], SignedDevice.prototype, "platform", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SignedDevice.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SignedDevice.prototype, "languageCode", void 0);
SignedDevice = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SignedDevice);
exports.SignedDevice = SignedDevice;
exports.SignedDeviceSchema = mongoose_1.SchemaFactory.createForClass(SignedDevice);
exports.SignedDeviceSchema.index({ _userId: 1 });
exports.SignedDeviceSchema.index({ _userId: 1, refreshToken: 'hashed' });
//# sourceMappingURL=signed-device.schema.js.map