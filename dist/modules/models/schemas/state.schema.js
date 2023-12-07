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
exports.StateSchema = exports.State = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const schemas_common_1 = require("../../../commons/schemas.common");
const embedded_country_schema_1 = require("./embedded/embedded-country.schema");
let State = class State extends schemas_common_1.CommonSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], State.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: embedded_country_schema_1.EmbeddedCountrySchema, required: true }),
    __metadata("design:type", embedded_country_schema_1.EmbeddedCountry)
], State.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], State.prototype, "countryCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], State.prototype, "iso2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], State.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], State.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], State.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], State.prototype, "sourceId", void 0);
State = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], State);
exports.State = State;
exports.StateSchema = mongoose_1.SchemaFactory.createForClass(State);
exports.StateSchema.index({
    'country.iso2': 1,
    name: 1,
});
//# sourceMappingURL=state.schema.js.map