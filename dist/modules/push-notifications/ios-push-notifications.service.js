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
exports.IosPushNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const libs_1 = require("../../libs");
let IosPushNotificationsService = class IosPushNotificationsService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async send(deviceToken, message) {
        return await this.firebaseService.firebase.messaging().send({
            apns: {
                headers: {
                    'apns-priority': '10',
                    'apns-expiration': '360000',
                },
                payload: {
                    aps: {
                        alert: {
                            title: message.title,
                            body: message.content,
                        },
                        badge: 1,
                        sound: 'default',
                    },
                },
            },
            token: deviceToken,
        });
    }
};
IosPushNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [libs_1.FirebaseService])
], IosPushNotificationsService);
exports.IosPushNotificationsService = IosPushNotificationsService;
//# sourceMappingURL=ios-push-notifications.service.js.map