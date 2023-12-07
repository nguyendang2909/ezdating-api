"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptsModule = void 0;
const common_1 = require("@nestjs/common");
const likes_module_1 = require("../likes/likes.module");
const profiles_module_1 = require("../profiles/profiles.module");
const api_script_1 = require("./api.script");
const profiles_script_1 = require("./profiles.script");
let ScriptsModule = class ScriptsModule {
};
ScriptsModule = __decorate([
    (0, common_1.Module)({
        imports: [likes_module_1.LikesModule, profiles_module_1.ProfilesModule],
        providers: [profiles_script_1.ProfilesScript, api_script_1.ApiScript],
    })
], ScriptsModule);
exports.ScriptsModule = ScriptsModule;
//# sourceMappingURL=scripts.module.js.map