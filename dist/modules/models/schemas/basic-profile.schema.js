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
exports.BasicProfileSchema = exports.BasicProfile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const constants_1 = require("../../../constants");
const embeded_state_schema_1 = require("./embedded/embeded-state.schema");
let BasicProfile = class BasicProfile extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], BasicProfile.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.GENDERS, required: true }),
    __metadata("design:type", Number)
], BasicProfile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 500 }),
    __metadata("design:type", String)
], BasicProfile.prototype, "introduce", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 100, required: true }),
    __metadata("design:type", String)
], BasicProfile.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: constants_1.RELATIONSHIP_GOALS, required: true }),
    __metadata("design:type", Number)
], BasicProfile.prototype, "relationshipGoal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: embeded_state_schema_1.EmbeddedStateSchema, required: true }),
    __metadata("design:type", embeded_state_schema_1.EmbeddedState)
], BasicProfile.prototype, "state", void 0);
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
], BasicProfile.prototype, "geolocation", void 0);
BasicProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BasicProfile);
exports.BasicProfile = BasicProfile;
exports.BasicProfileSchema = mongoose_1.SchemaFactory.createForClass(BasicProfile);
//# sourceMappingURL=basic-profile.schema.js.map