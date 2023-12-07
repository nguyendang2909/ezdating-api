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
exports.MediaFileSchema = exports.MediaFile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const constants_1 = require("../../../constants");
let MediaFile = class MediaFile extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", mongoose_3.Types.ObjectId)
], MediaFile.prototype, "_userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MediaFile.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.MEDIA_FILE_TYPES, required: true }),
    __metadata("design:type", Number)
], MediaFile.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], MediaFile.prototype, "location", void 0);
MediaFile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MediaFile);
exports.MediaFile = MediaFile;
exports.MediaFileSchema = mongoose_1.SchemaFactory.createForClass(MediaFile);
//# sourceMappingURL=media-file.schema.js.map