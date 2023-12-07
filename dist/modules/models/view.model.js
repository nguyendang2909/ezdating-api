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
exports.ViewModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const messages_1 = require("../../commons/messages");
const common_model_1 = require("./bases/common-model");
const view_schema_1 = require("./schemas/view.schema");
let ViewModel = class ViewModel extends common_model_1.CommonModel {
    constructor(model) {
        super();
        this.model = model;
        this.notFoundMessage = messages_1.ERROR_MESSAGES['View does not exist'];
        this.conflictMessage = messages_1.ERROR_MESSAGES['View already exists'];
    }
};
ViewModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(view_schema_1.View.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ViewModel);
exports.ViewModel = ViewModel;
//# sourceMappingURL=view.model.js.map