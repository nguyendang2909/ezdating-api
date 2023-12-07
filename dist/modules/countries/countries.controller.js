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
exports.CountriesController = void 0;
const common_1 = require("@nestjs/common");
const is_public_endpoint_1 = require("../../commons/decorators/is-public.endpoint");
const countries_service_1 = require("./countries.service");
const find_one_country_params_dto_1 = require("./dto/find-one-country-params.dto");
let CountriesController = class CountriesController {
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    async findAll() {
        return { type: 'countries', data: await this.countriesService.findAll() };
    }
    async findOne(params) {
        return {
            type: 'country',
            data: await this.countriesService.findOneOrFail(params.id),
        };
    }
};
__decorate([
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "findAll", null);
__decorate([
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_one_country_params_dto_1.FindOneCountryParamsDto]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "findOne", null);
CountriesController = __decorate([
    (0, common_1.Controller)('countries'),
    __metadata("design:paramtypes", [countries_service_1.CountriesService])
], CountriesController);
exports.CountriesController = CountriesController;
//# sourceMappingURL=countries.controller.js.map