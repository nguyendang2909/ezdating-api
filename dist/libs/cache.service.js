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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const redlock_1 = __importDefault(require("redlock"));
const constants_1 = require("../constants");
let CacheService = CacheService_1 = class CacheService {
    constructor(redis, redlock) {
        this.redis = redis;
        this.redlock = redlock;
        this.logger = new common_1.Logger(CacheService_1.name);
    }
    async setex(key, ttl, value) {
        return this.redis.setex(key, ttl + Math.floor(Math.random() * ttl), JSON.stringify(value));
    }
    async ttl(key) {
        return await this.redis.ttl(key);
    }
    async getJSON(key) {
        const value = await this.redis.get(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }
    async lock(key, duration = 10) {
        return await this.redlock.acquire([key], duration * 1000);
    }
};
CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.MODULE_INSTANCES.REDIS)),
    __param(1, (0, common_1.Inject)(constants_1.MODULE_INSTANCES.REDIS_LOCK)),
    __metadata("design:paramtypes", [ioredis_1.default,
        redlock_1.default])
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map