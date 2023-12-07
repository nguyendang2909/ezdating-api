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
exports.LikesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const find_user_like_me_dto_1 = require("./dto/find-user-like-me.dto");
const send_like_dto_1 = require("./dto/send-like.dto");
const likes_service_1 = require("./likes.service");
let LikesController = class LikesController {
    constructor(service) {
        this.service = service;
    }
    async send(payload, clientData) {
        return {
            type: 'sendLike',
            data: await this.service.send(payload, clientData),
        };
    }
    async findManyLikedMe(queryParams, clientData) {
        const likes = await this.service.findManyLikedMe(queryParams, clientData);
        return {
            type: 'likedMe',
            data: likes,
            pagination: this.service.getPagination(likes),
        };
    }
    async findOneLikeMeById(id, client) {
        return {
            type: 'likeMe',
            data: await this.service.findOneLikeMeById(id, client),
        };
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_like_dto_1.SendLikeDto, Object]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "send", null);
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_user_like_me_dto_1.FindManyLikedMeDto, Object]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "findManyLikedMe", null);
__decorate([
    (0, common_1.Get)('/me/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "findOneLikeMeById", null);
LikesController = __decorate([
    (0, common_1.Controller)('/likes'),
    (0, swagger_1.ApiTags)('/likes'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [likes_service_1.LikesService])
], LikesController);
exports.LikesController = LikesController;
//# sourceMappingURL=likes.controller.js.map