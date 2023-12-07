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
exports.LibsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const google_auth_library_1 = require("google-auth-library");
const ioredis_1 = require("ioredis");
const redlock_1 = __importDefault(require("redlock"));
const app_config_1 = require("../app.config");
const constants_1 = require("../constants");
const access_tokens_service_1 = require("./access-tokens.service");
const cache_service_1 = require("./cache.service");
const files_service_1 = require("./files.service");
const firebase_service_1 = require("./firebase.service");
const google_oauth_service_1 = require("./google-oauth.service");
const password_service_1 = require("./password.service");
const refresh_tokens_service_1 = require("./refresh-tokens.service");
let LibsModule = class LibsModule {
};
LibsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: {
                    expiresIn: app_config_1.APP_CONFIG.ACCESS_TOKEN_EXPIRES,
                },
            }),
        ],
        providers: [
            access_tokens_service_1.AccessTokensService,
            refresh_tokens_service_1.RefreshTokensService,
            password_service_1.PasswordsService,
            files_service_1.FilesService,
            {
                provide: constants_1.MODULE_INSTANCES.REDIS,
                useFactory: () => {
                    const logger = new common_1.Logger('REDIS');
                    const environmentOptions = {};
                    const optionsOverride = { ttl: 15 * 60 };
                    const IOREDIS_MODE = process.env.IOREDIS_MODE || 'standalone';
                    const REDIS_HOST = process.env.REDIS_HOST;
                    const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10) || 6379;
                    if (IOREDIS_MODE === 'standalone') {
                        environmentOptions.host = REDIS_HOST;
                        environmentOptions.port = REDIS_PORT;
                        environmentOptions.password = process.env.IOREDIS_STANDALONE_PASSWORD;
                    }
                    const redis = new ioredis_1.Redis(`${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
                    redis.on('error', (err) => {
                        logger.error(err, 'IORedis');
                    });
                    redis.on('connect', () => {
                        logger.log('Connected to Redis', 'IORedis');
                    });
                    return redis;
                },
            },
            {
                provide: constants_1.MODULE_INSTANCES.REDIS_LOCK,
                inject: [constants_1.MODULE_INSTANCES.REDIS],
                useFactory: (redis) => {
                    return new redlock_1.default([redis], {
                        driftFactor: 0.01,
                        retryCount: 10,
                        retryDelay: 200,
                        retryJitter: 200,
                        automaticExtensionThreshold: 500,
                    });
                },
            },
            {
                provide: constants_1.MODULE_INSTANCES.FIREBASE,
                useFactory: () => {
                    return firebase_admin_1.default.initializeApp({
                        credential: firebase_admin_1.default.credential.cert({
                            projectId: process.env.FIREBASE_PROJECT_ID,
                            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                            privateKey: process.env.FIREBASE_PRIVATE_KEY,
                        }),
                    });
                },
            },
            {
                provide: constants_1.MODULE_INSTANCES.GOOGLE_OAUTH_CLIENT,
                useFactory: () => {
                    return new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
                },
            },
            cache_service_1.CacheService,
            firebase_service_1.FirebaseService,
            google_oauth_service_1.GoogleOAuthService,
        ],
        exports: [
            files_service_1.FilesService,
            cache_service_1.CacheService,
            firebase_service_1.FirebaseService,
            google_oauth_service_1.GoogleOAuthService,
            access_tokens_service_1.AccessTokensService,
            refresh_tokens_service_1.RefreshTokensService,
            password_service_1.PasswordsService,
        ],
    })
], LibsModule);
exports.LibsModule = LibsModule;
//# sourceMappingURL=libs.module.js.map