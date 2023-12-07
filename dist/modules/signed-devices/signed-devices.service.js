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
exports.SignedDevicesService = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("../../commons/services/api.service");
const signed_device_model_1 = require("../models/signed-device.model");
let SignedDevicesService = class SignedDevicesService extends api_service_1.ApiService {
    constructor(signedDeviceModel) {
        super();
        this.signedDeviceModel = signedDeviceModel;
    }
    async updateOne(payload, client) {
        const { _currentUserId } = this.getClient(client);
        const signedDevice = await this.signedDeviceModel.findOneOrFail({
            _userId: _currentUserId,
            refreshToken: payload.refreshToken,
        });
        if (signedDevice.token === payload.deviceToken &&
            signedDevice.platform === payload.devicePlatform) {
            return;
        }
        await this.signedDeviceModel.deleteMany({
            deviceToken: payload.deviceToken,
            devicePlatform: payload.devicePlatform,
        });
        await this.signedDeviceModel.updateOneOrFailById(signedDevice._id, {
            $set: {
                token: payload.deviceToken,
                platform: payload.devicePlatform,
            },
        });
    }
};
SignedDevicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [signed_device_model_1.SignedDeviceModel])
], SignedDevicesService);
exports.SignedDevicesService = SignedDevicesService;
//# sourceMappingURL=signed-devices.service.js.map