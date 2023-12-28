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
exports.CoinsService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const commons_1 = require("../../commons");
const constants_1 = require("../../constants");
const models_1 = require("../models");
let CoinsService = class CoinsService extends commons_1.ApiBaseService {
    constructor(coinAttendanceModel, userModel) {
        super();
        this.coinAttendanceModel = coinAttendanceModel;
        this.userModel = userModel;
    }
    async findManyAttendances(client) {
        const { _currentUserId } = this.getClient(client);
        const newestAttendance = await this.takeAttendance(_currentUserId).catch(() => {
            return undefined;
        });
        const attendances = await this.coinAttendanceModel.findMany({}, {}, {
            limit: newestAttendance
                ? newestAttendance.data.receivedDateIndex + 1
                : 7,
        });
        return {
            isReceivedAttendance: !!newestAttendance,
            data: newestAttendance
                ? attendances
                : this.coinAttendanceModel.getByStartDays(attendances),
        };
    }
    async takeAttendance(_currentUserId) {
        const todayDate = (0, moment_1.default)().startOf('date').toDate();
        const lastCoinAttendance = await this.coinAttendanceModel.findOne({
            _userId: _currentUserId,
        });
        if (!lastCoinAttendance) {
            return {
                isReceivedAttendance: true,
                data: await this.createDailyAttendance({
                    _userId: _currentUserId,
                    receivedDate: todayDate,
                    value: constants_1.WEEKLY_COINS[0],
                    receivedDateIndex: 0,
                }),
            };
        }
        if ((0, moment_1.default)(lastCoinAttendance.receivedDate).isSameOrAfter((0, moment_1.default)(todayDate))) {
            return { data: lastCoinAttendance, isReceivedAttendance: false };
        }
        const nextReceivedDayIndex = this.coinAttendanceModel.getNextReceivedDayIndexFromValue(lastCoinAttendance.value);
        return {
            isReceivedAttendance: true,
            data: await this.createDailyAttendance({
                _userId: _currentUserId,
                receivedDate: todayDate,
                receivedDateIndex: nextReceivedDayIndex,
                value: this.coinAttendanceModel.getValueFromReceivedDayIndex(nextReceivedDayIndex),
            }),
        };
    }
    async createDailyAttendance({ _userId, receivedDate, value, receivedDateIndex, }) {
        const coinAttendance = await this.coinAttendanceModel.createOne({
            _userId,
            receivedDate,
            value,
            receivedDateIndex,
        });
        await this.userModel.updateOne({ _id: _userId }, { $inc: { coins: value } });
        return coinAttendance;
    }
};
CoinsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.CoinAttendanceModel,
        models_1.UserModel])
], CoinsService);
exports.CoinsService = CoinsService;
//# sourceMappingURL=coins.service.js.map