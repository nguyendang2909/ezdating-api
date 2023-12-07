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
exports.MediaFileModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const error_messages_constant_1 = require("../../commons/messages/error-messages.constant");
const common_model_1 = require("./bases/common-model");
const profile_model_1 = require("./profile.model");
const media_file_schema_1 = require("./schemas/media-file.schema");
let MediaFileModel = class MediaFileModel extends common_model_1.CommonModel {
    constructor(model, profileModel) {
        super();
        this.model = model;
        this.profileModel = profileModel;
        this.notFoundMessage = error_messages_constant_1.ERROR_MESSAGES['Media file does not exist'];
        this.conflictMessage = error_messages_constant_1.ERROR_MESSAGES['Media file already exists'];
    }
};
MediaFileModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(media_file_schema_1.MediaFile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        profile_model_1.ProfileModel])
], MediaFileModel);
exports.MediaFileModel = MediaFileModel;
//# sourceMappingURL=media-file.model.js.map