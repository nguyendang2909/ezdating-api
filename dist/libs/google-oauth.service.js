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
var GoogleOAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const constants_1 = require("../constants");
let GoogleOAuthService = GoogleOAuthService_1 = class GoogleOAuthService {
    constructor(oauthClient) {
        this.oauthClient = oauthClient;
        this.logger = new common_1.Logger(GoogleOAuthService_1.name);
    }
};
GoogleOAuthService = GoogleOAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.MODULE_INSTANCES.GOOGLE_OAUTH_CLIENT)),
    __metadata("design:paramtypes", [google_auth_library_1.OAuth2Client])
], GoogleOAuthService);
exports.GoogleOAuthService = GoogleOAuthService;
//# sourceMappingURL=google-oauth.service.js.map