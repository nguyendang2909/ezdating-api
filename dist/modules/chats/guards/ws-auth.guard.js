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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const websockets_1 = require("@nestjs/websockets");
const lodash_1 = __importDefault(require("lodash"));
const libs_1 = require("../../../libs");
let WsAuthGuard = class WsAuthGuard {
    constructor(reflector, accessTokensService) {
        this.reflector = reflector;
        this.accessTokensService = accessTokensService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = client.handshake.query.token;
        if (!token || !lodash_1.default.isString(token)) {
            throw new websockets_1.WsException({ status: 401, message: 'Unauthorized' });
        }
        const decoded = this.accessTokensService.verify(token);
        client.handshake.user = decoded;
        return true;
    }
};
WsAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        libs_1.AccessTokensService])
], WsAuthGuard);
exports.WsAuthGuard = WsAuthGuard;
//# sourceMappingURL=ws-auth.guard.js.map