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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const app_config_1 = require("../../app.config");
const constants_1 = require("../../constants");
const signed_device_model_1 = require("../models/signed-device.model");
const android_push_notifications_service_1 = require("./android-push-notifications.service");
const ios_push_notifications_service_1 = require("./ios-push-notifications.service");
let PushNotificationsService = class PushNotificationsService {
    constructor(iosService, androidService, signedDeviceModel) {
        this.iosService = iosService;
        this.androidService = androidService;
        this.signedDeviceModel = signedDeviceModel;
    }
    async send(payload) {
        if (payload.devicePlatform === constants_1.DEVICE_PLATFORMS.IOS) {
            return await this.iosService.send(payload.deviceToken, {
                title: payload.title,
                content: payload.content,
            });
        }
        if (payload.devicePlatform === constants_1.DEVICE_PLATFORMS.ANDROID) {
            await this.androidService.send(payload.deviceToken, {
                title: payload.title,
                content: payload.content,
            });
        }
    }
    async sendByDevices(devices, payload) {
        return await Promise.all(devices
            .map((e) => {
            if (!e.token || !e.platform) {
                return;
            }
            return this.send({
                content: payload.content,
                title: 'You have received new message',
                deviceToken: e.token,
                devicePlatform: e.platform,
            });
        })
            .filter((e) => !!e));
    }
    async sendByUserId(_userId, payload) {
        const devices = await this.signedDeviceModel.findMany({
            _userId,
            token: {
                $exists: true,
            },
        });
        return await this.sendByDevices(devices, payload);
    }
    async sendByProfile(profile, payload, options = {}) {
        const recentActive = !!options.recentActive;
        if (recentActive && !this.canPushByProfile(profile)) {
            return;
        }
        const devices = await this.signedDeviceModel.findMany({
            _userId: profile._id,
            token: {
                $exists: true,
            },
        });
        return await this.sendByDevices(devices, payload);
    }
    canPushByProfile(profile) {
        return (!!profile.lastActivatedAt &&
            (0, moment_1.default)().diff(profile.lastActivatedAt, 'days') <=
                app_config_1.APP_CONFIG.PROFIFLE.LOW_ACTIVITY.MINIMUM_INACTIVITY_DATE);
    }
};
PushNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ios_push_notifications_service_1.IosPushNotificationsService,
        android_push_notifications_service_1.AndroidPushNotificationsService,
        signed_device_model_1.SignedDeviceModel])
], PushNotificationsService);
exports.PushNotificationsService = PushNotificationsService;
//# sourceMappingURL=push-notifications.service.js.map