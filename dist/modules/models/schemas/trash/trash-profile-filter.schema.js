"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashProfileFilterSchema = exports.TrashProfileFilter = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const profile_filter_schema_1 = require("../profile-filter.schema");
let TrashProfileFilter = class TrashProfileFilter extends profile_filter_schema_1.ProfileFilter {
};
TrashProfileFilter = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TrashProfileFilter);
exports.TrashProfileFilter = TrashProfileFilter;
exports.TrashProfileFilterSchema = mongoose_1.SchemaFactory.createForClass(TrashProfileFilter);
//# sourceMappingURL=trash-profile-filter.schema.js.map