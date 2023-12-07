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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddedMediaFileSchema = exports.EmbeddedMediaFile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../../commons/schemas.common");
const constants_1 = require("../../../../constants");
let EmbeddedMediaFile = class EmbeddedMediaFile extends schemas_common_1.CommonEmbeddedSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], EmbeddedMediaFile.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.MEDIA_FILE_TYPES, required: true }),
    __metadata("design:type", Number)
], EmbeddedMediaFile.prototype, "type", void 0);
EmbeddedMediaFile = __decorate([
    (0, mongoose_1.Schema)()
], EmbeddedMediaFile);
exports.EmbeddedMediaFile = EmbeddedMediaFile;
exports.EmbeddedMediaFileSchema = mongoose_1.SchemaFactory.createForClass(EmbeddedMediaFile);
//# sourceMappingURL=embedded-media-file.schema.js.map