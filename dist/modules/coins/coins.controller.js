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
exports.CoinsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const constants_1 = require("../../constants");
const coins_service_1 = require("./coins.service");
let CoinsController = class CoinsController {
    constructor(coinsService) {
        this.coinsService = coinsService;
    }
    async findManyAttendances(clientData) {
        return Object.assign({ type: constants_1.RESPONSE_TYPES.DAILY_ATTENDANCE }, (await this.coinsService.findManyAttendances(clientData)));
    }
};
__decorate([
    (0, common_1.Post)('/me/attendances'),
    __param(0, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "findManyAttendances", null);
CoinsController = __decorate([
    (0, common_1.Controller)('coins'),
    __metadata("design:paramtypes", [coins_service_1.CoinsService])
], CoinsController);
exports.CoinsController = CoinsController;
//# sourceMappingURL=coins.controller.js.map