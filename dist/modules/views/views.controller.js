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
exports.ViewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const dto_1 = require("./dto");
const send_view_dto_1 = require("./dto/send-view.dto");
const views_read_service_1 = require("./services/views-read.service");
const views_write_service_1 = require("./services/views-write.service");
let ViewsController = class ViewsController {
    constructor(readService, writeService) {
        this.readService = readService;
        this.writeService = writeService;
    }
    async send(payload, clientData) {
        return {
            type: 'send_view',
            data: await this.writeService.send(payload, clientData),
        };
    }
    async findMany(queryParams, clientData) {
        const findResults = await this.readService.findMany(queryParams, clientData);
        return {
            type: 'views',
            data: findResults,
            pagination: this.readService.getPagination(findResults),
        };
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_view_dto_1.SendViewDto, Object]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "send", null);
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindManyViewsQuery, Object]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "findMany", null);
ViewsController = __decorate([
    (0, common_1.Controller)('/views'),
    (0, swagger_1.ApiTags)('/views'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [views_read_service_1.ViewsReadService,
        views_write_service_1.ViewsWriteService])
], ViewsController);
exports.ViewsController = ViewsController;
//# sourceMappingURL=views.controller.js.map