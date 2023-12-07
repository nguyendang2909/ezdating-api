"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const android_push_notifications_service_1 = require("./android-push-notifications.service");
const ios_push_notifications_service_1 = require("./ios-push-notifications.service");
const push_notifications_service_1 = require("./push-notifications.service");
let PushNotificationsModule = class PushNotificationsModule {
};
PushNotificationsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            push_notifications_service_1.PushNotificationsService,
            android_push_notifications_service_1.AndroidPushNotificationsService,
            ios_push_notifications_service_1.IosPushNotificationsService,
        ],
        exports: [push_notifications_service_1.PushNotificationsService],
    })
], PushNotificationsModule);
exports.PushNotificationsModule = PushNotificationsModule;
//# sourceMappingURL=push-notifications.module.js.map