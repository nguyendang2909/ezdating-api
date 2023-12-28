"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileApiBaseService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const messages_1 = require("../../../commons/messages");
const api_service_1 = require("../../../commons/services/api.service");
const common_constants_1 = require("../../../constants/common.constants");
class ProfileApiBaseService extends api_service_1.ApiService {
    getAndCheckValidBirthdayFromRaw(rawBirthday) {
        const birthdayMoment = (0, moment_1.default)(rawBirthday, common_constants_1.DATE_FORMATS.RAW_BIRTHDAY).utc(true);
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
}
exports.ProfileApiBaseService = ProfileApiBaseService;
//# sourceMappingURL=profiles.api.base.service.js.map