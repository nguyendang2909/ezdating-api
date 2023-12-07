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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedDevicesController = void 0;
const common_1 = require("@nestjs/common");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const constants_1 = require("../../constants");
const dto_1 = require("./dto");
const signed_devices_service_1 = require("./signed-devices.service");
let SignedDevicesController = class SignedDevicesController {
    constructor(service) {
        this.service = service;
    }
    async update(payload, client) {
        await this.service.updateOne(payload, client);
        return {
            type: constants_1.RESPONSE_TYPES.UPDATE_DEVICE_TOKEN,
        };
    }
};
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateSignedDeviceDto, Object]),
    __metadata("design:returntype", Promise)
], SignedDevicesController.prototype, "update", null);
SignedDevicesController = __decorate([
    (0, common_1.Controller)('signed-devices'),
    __metadata("design:paramtypes", [signed_devices_service_1.SignedDevicesService])
], SignedDevicesController);
exports.SignedDevicesController = SignedDevicesController;
//# sourceMappingURL=signed-devices.controller.js.map