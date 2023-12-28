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
exports.ProfileSchema = exports.Profile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const constants_1 = require("../../../constants");
const embedded_media_file_schema_1 = require("./embedded/embedded-media-file.schema");
const embeded_state_schema_1 = require("./embedded/embeded-state.schema");
let Profile = class Profile extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Profile.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Profile.prototype, "company", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.EDUCATION_LEVELS }),
    __metadata("design:type", Number)
], Profile.prototype, "educationLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.GENDERS, required: true }),
    __metadata("design:type", Number)
], Profile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            enum: ['Point'],
            required: false,
            type: String,
        },
        coordinates: {
            required: false,
            type: [Number],
        },
    }),
    __metadata("design:type", Object)
], Profile.prototype, "geolocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Profile.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 500 }),
    __metadata("design:type", String)
], Profile.prototype, "introduce", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Profile.prototype, "jobTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Profile.prototype, "hideAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Profile.prototype, "hideDistance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Profile.prototype, "languages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], Profile.prototype, "lastActivatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [embedded_media_file_schema_1.EmbeddedMediaFileSchema], minlength: 1 }),
    __metadata("design:type", Array)
], Profile.prototype, "mediaFiles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constants_1.MEMBERSHIPS, default: 1 }),
    __metadata("design:type", Number)
], Profile.prototype, "membership", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 100, required: true }),
    __metadata("design:type", String)
], Profile.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Profile.prototype, "photoVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.RELATIONSHIP_GOALS, required: true }),
    __metadata("design:type", Number)
], Profile.prototype, "relationshipGoal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.RELATIONSHIP_STATUSES }),
    __metadata("design:type", Number)
], Profile.prototype, "relationshipStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Profile.prototype, "school", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: embeded_state_schema_1.EmbeddedStateSchema, required: true }),
    __metadata("design:type", embeded_state_schema_1.EmbeddedState)
], Profile.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Profile.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Profile.prototype, "learningTarget", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Profile.prototype, "teachingSubject", void 0);
Profile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Profile);
exports.Profile = Profile;
exports.ProfileSchema = mongoose_1.SchemaFactory.createForClass(Profile);
exports.ProfileSchema.index({
    geolocation: '2dsphere',
    lastActivated: 1,
    birthday: 1,
    gender: 1,
});
exports.ProfileSchema.index({
    lastActivatedAt: 1,
    birthday: 1,
    _id: 1,
    'state._id': 1,
    gender: 1,
});
//# sourceMappingURL=profile.schema.js.map