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
exports.EmbeddedProfileSchema = exports.EmbeddedProfile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../../commons/schemas.common");
const constants_1 = require("../../../../constants");
const embedded_media_file_schema_1 = require("./embedded-media-file.schema");
const embeded_state_schema_1 = require("./embeded-state.schema");
let EmbeddedProfile = class EmbeddedProfile extends schemas_common_1.CommonEmbeddedSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], EmbeddedProfile.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.GENDERS, required: true }),
    __metadata("design:type", Number)
], EmbeddedProfile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], EmbeddedProfile.prototype, "hideAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], EmbeddedProfile.prototype, "hideDistance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 500 }),
    __metadata("design:type", String)
], EmbeddedProfile.prototype, "introduce", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], EmbeddedProfile.prototype, "lastActivatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [embedded_media_file_schema_1.EmbeddedMediaFileSchema], minlength: 1 }),
    __metadata("design:type", Array)
], EmbeddedProfile.prototype, "mediaFiles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 100, required: true }),
    __metadata("design:type", String)
], EmbeddedProfile.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], EmbeddedProfile.prototype, "photoVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: embeded_state_schema_1.EmbeddedStateSchema, required: false }),
    __metadata("design:type", embeded_state_schema_1.EmbeddedState)
], EmbeddedProfile.prototype, "state", void 0);
EmbeddedProfile = __decorate([
    (0, mongoose_1.Schema)()
], EmbeddedProfile);
exports.EmbeddedProfile = EmbeddedProfile;
exports.EmbeddedProfileSchema = mongoose_1.SchemaFactory.createForClass(EmbeddedProfile);
//# sourceMappingURL=embedded-profile.schema.js.map