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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const constants_1 = require("../../constants");
const dto_1 = require("./dto");
const matches_service_1 = require("./matches.service");
let MatchesController = class MatchesController {
    constructor(service) {
        this.service = service;
    }
    async createOne(payload, client) {
        return {
            type: constants_1.RESPONSE_TYPES.CREATE_MATCH,
            data: await this.service.createOne(payload, client),
        };
    }
    async unmatch(id, clientData) {
        return {
            type: constants_1.RESPONSE_TYPES.UNMATCH,
            data: await this.service.unmatch(id, clientData),
        };
    }
    async findMatched(queryParams, clientData) {
        const findResults = await this.service.findMany(queryParams, clientData);
        return {
            type: constants_1.RESPONSE_TYPES.MATCHES,
            data: findResults,
            pagination: this.service.getPagination(findResults),
        };
    }
    async findOneByTargetUserId(targetUserId, client) {
        return {
            type: constants_1.RESPONSE_TYPES.MATCH,
            data: await this.service.findOneByTargetUserId(targetUserId, client),
        };
    }
    async findOneById(id, clientData) {
        return {
            type: constants_1.RESPONSE_TYPES.MATCH,
            data: await this.service.findOneOrFailById(id, clientData),
        };
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMatchDto, Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "createOne", null);
__decorate([
    (0, common_1.Post)('/unmatch/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "unmatch", null);
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindManyMatchesQuery, Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "findMatched", null);
__decorate([
    (0, common_1.Get)('/target-user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "findOneByTargetUserId", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "findOneById", null);
MatchesController = __decorate([
    (0, common_1.Controller)('/matches'),
    (0, swagger_1.ApiTags)('/matches'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
exports.MatchesController = MatchesController;
//# sourceMappingURL=matches.controller.js.map