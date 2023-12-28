"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const profiles_controller_1 = require("./profiles.controller");
const basic_profile_write_service_1 = require("./services/basic-profile-write.service");
const nearby_profiles_service_1 = require("./services/nearby-profiles.service");
const profiles_read_service_1 = require("./services/profiles-read.service");
const profiles_read_me_service_1 = require("./services/profiles-read-me.service");
const profiles_write_me_service_1 = require("./services/profiles-write-me.service");
const swipe_profiles_service_1 = require("./services/swipe-profiles.service");
let ProfilesModule = class ProfilesModule {
};
ProfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [profiles_controller_1.ProfilesController],
        providers: [
            basic_profile_write_service_1.BasicProfileWriteService,
            nearby_profiles_service_1.NearbyProfilesService,
            profiles_read_me_service_1.ProfilesReadMeService,
            profiles_read_service_1.ProfilesReadService,
            profiles_write_me_service_1.ProfilesWriteMeService,
            profiles_read_service_1.ProfilesReadService,
            swipe_profiles_service_1.SwipeProfilesService,
        ],
        exports: [],
    })
], ProfilesModule);
exports.ProfilesModule = ProfilesModule;
//# sourceMappingURL=profiles.module.js.map