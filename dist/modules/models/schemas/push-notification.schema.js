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
exports.PushNotificationSchema = exports.PushNotification = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
let PushNotification = class PushNotification extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PushNotification.prototype, "_userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PushNotification.prototype, "_targetUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PushNotification.prototype, "_signedDeviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], PushNotification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], PushNotification.prototype, "content", void 0);
PushNotification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PushNotification);
exports.PushNotification = PushNotification;
exports.PushNotificationSchema = mongoose_1.SchemaFactory.createForClass(PushNotification);
//# sourceMappingURL=push-notification.schema.js.map