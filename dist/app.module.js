"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const nest_winston_1 = require("nest-winston");
const winston_1 = __importDefault(require("winston"));
const app_config_1 = require("./app.config");
const libs_module_1 = require("./libs/libs.module");
const admin_auth_module_1 = require("./modules/admin/admin-auth/admin-auth.module");
const auth_module_1 = require("./modules/auth/auth.module");
const chats_module_1 = require("./modules/chats/chats.module");
const conversations_module_1 = require("./modules/conversations/conversations.module");
const countries_module_1 = require("./modules/countries/countries.module");
const jwt_guard_1 = require("./modules/guards/jwt.guard");
const roles_guard_1 = require("./modules/guards/roles.guard");
const health_module_1 = require("./modules/health/health.module");
const likes_module_1 = require("./modules/likes/likes.module");
const matches_module_1 = require("./modules/matches/matches.module");
const media_files_module_1 = require("./modules/media-files/media-files.module");
const messages_module_1 = require("./modules/messages/messages.module");
const models_module_1 = require("./modules/models/models.module");
const profile_filters_module_1 = require("./modules/profile-filters/profile-filters.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const push_notifications_module_1 = require("./modules/push-notifications/push-notifications.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const scripts_module_1 = require("./modules/scripts/scripts.module");
const signed_devices_module_1 = require("./modules/signed-devices/signed-devices.module");
const users_module_1 = require("./modules/users/users.module");
const views_module_1 = require("./modules/views/views.module");
const utils_1 = require("./utils");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston_1.default.transports.Console({
                        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.ms(), nest_winston_1.utilities.format.nestLike(app_config_1.APP_CONFIG.APP_NAME, {
                            prettyPrint: true,
                            colors: true,
                        })),
                    }),
                ],
            }),
            throttler_1.ThrottlerModule.forRoot([
                process.env.NODE_ENV === 'production'
                    ? { ttl: 10, limit: 100 }
                    : { ttl: 10, limit: 1000 },
            ]),
            mongoose_1.MongooseModule.forRoot(`${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}?directConnection=true`, {
                dbName: process.env.MONGO_DB_NAME,
                user: process.env.MONGO_DB_USER,
                pass: process.env.MONGO_DB_PASS,
                autoIndex: process.env.MONGO_DB_AUTO_INDEX === 'true',
            }),
            schedule_1.ScheduleModule.forRoot(),
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT, 10),
                },
            }),
            models_module_1.ModelsModule,
            utils_1.UtilsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            chats_module_1.ChatsModule,
            matches_module_1.MatchesModule,
            messages_module_1.MessagesModule,
            media_files_module_1.MediaFilesModule,
            signed_devices_module_1.LoggedDevicesModule,
            conversations_module_1.ConversationsModule,
            health_module_1.HealthModule,
            views_module_1.ViewsModule,
            likes_module_1.LikesModule,
            push_notifications_module_1.PushNotificationsModule,
            libs_module_1.LibsModule,
            admin_auth_module_1.AdminAuthModule,
            profiles_module_1.ProfilesModule,
            schedules_module_1.SchedulesModule,
            scripts_module_1.ScriptsModule,
            profile_filters_module_1.ProfileFiltersModule,
            countries_module_1.CountriesModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: jwt_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map