"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesUtil = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const messages_1 = require("../commons/messages");
const constants_1 = require("../constants");
const base_util_1 = require("./bases/base.util");
let ProfilesUtil = class ProfilesUtil extends base_util_1.BaseUtil {
    verifyBirthdayFromRaw(rawBirthday) {
        const birthdayMoment = (0, moment_1.default)(rawBirthday, constants_1.DATE_FORMATS.RAW_BIRTHDAY).utc(true);
        const momentNow = (0, moment_1.default)();
        const age = momentNow.diff(birthdayMoment, 'years', true);
        if (age < 18) {
            throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['Please make sure you are over 18 years old']);
        }
        if (age > 100) {
            throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['Please make sure you are under 100 years old']);
        }
        return birthdayMoment.toDate();
    }
    getGeolocationFromQueryParams(payload) {
        return {
            type: 'Point',
            coordinates: [+payload.longitude, +payload.latitude],
        };
    }
};
ProfilesUtil = __decorate([
    (0, common_1.Injectable)()
], ProfilesUtil);
exports.ProfilesUtil = ProfilesUtil;
//# sourceMappingURL=profiles.util.js.map