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
exports.CoinAttendanceModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../constants");
const common_model_1 = require("./bases/common-model");
const coin_attendance_schema_1 = require("./schemas/coin-attendance.schema");
let CoinAttendanceModel = class CoinAttendanceModel extends common_model_1.CommonModel {
    constructor(model) {
        super();
        this.model = model;
    }
    getReceivedDayIndex(value) {
        return constants_1.WEEKLY_COINS.findIndex((item) => item === value);
    }
    getNextReceiveDayIndex(lastReceivedDayIndex) {
        return lastReceivedDayIndex !== constants_1.WEEKLY_COINS_LENGTH - 1
            ? lastReceivedDayIndex + 1
            : 0;
    }
    getNextReceivedDayIndexFromValue(value) {
        const receivedDayIndex = this.getReceivedDayIndex(value);
        return receivedDayIndex !== constants_1.WEEKLY_COINS_LENGTH - 1
            ? receivedDayIndex + 1
            : 0;
    }
    getValueFromReceivedDayIndex(receivedDayIndex) {
        return constants_1.WEEKLY_COINS[receivedDayIndex] || 0;
    }
    getByStartDays(documents) {
        let flag = false;
        const findResults = [];
        for (const document of documents) {
            if (flag) {
                findResults.push(document);
            }
            else if (document.receivedDateIndex === 0) {
                flag = true;
                findResults.push(document);
            }
        }
        return findResults;
    }
};
CoinAttendanceModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(coin_attendance_schema_1.CoinAttendance.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CoinAttendanceModel);
exports.CoinAttendanceModel = CoinAttendanceModel;
//# sourceMappingURL=coin-attendance.model.js.map