"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsModule = void 0;
const common_1 = require("@nestjs/common");
const paginations_1 = require("./paginations");
const profiles_util_1 = require("./profiles.util");
let UtilsModule = class UtilsModule {
};
UtilsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        exports: [
            profiles_util_1.ProfilesUtil,
            paginations_1.PaginationCursorStringUtil,
            paginations_1.PaginationCursorDateUtil,
            paginations_1.PaginationCursorObjectIdUtil,
            paginations_1.PaginationCursorNumberUtil,
        ],
        controllers: [],
        providers: [
            profiles_util_1.ProfilesUtil,
            paginations_1.PaginationCursorStringUtil,
            paginations_1.PaginationCursorDateUtil,
            paginations_1.PaginationCursorObjectIdUtil,
            paginations_1.PaginationCursorNumberUtil,
        ],
    })
], UtilsModule);
exports.UtilsModule = UtilsModule;
//# sourceMappingURL=utils.module.js.map