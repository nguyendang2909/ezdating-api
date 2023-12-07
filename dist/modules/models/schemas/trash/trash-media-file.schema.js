"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashMediaFileSchema = exports.TrashMediaFile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const media_file_schema_1 = require("../media-file.schema");
let TrashMediaFile = class TrashMediaFile extends media_file_schema_1.MediaFile {
};
TrashMediaFile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TrashMediaFile);
exports.TrashMediaFile = TrashMediaFile;
exports.TrashMediaFileSchema = mongoose_1.SchemaFactory.createForClass(TrashMediaFile);
//# sourceMappingURL=trash-media-file.schema.js.map