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
var HealthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const crypto_1 = __importDefault(require("crypto"));
const is_public_endpoint_1 = require("../../commons/decorators/is-public.endpoint");
let HealthController = HealthController_1 = class HealthController {
    constructor() {
        this.logger = new common_1.Logger(HealthController_1.name);
        this.GITHUB_WEBHOOK_SECRET_KEY = process.env.GITHUB_WEBHOOK_SECRET_KEY;
    }
    deployDevelop(res, req) {
        if (this.GITHUB_WEBHOOK_SECRET_KEY) {
            const signature = crypto_1.default
                .createHmac('sha256', this.GITHUB_WEBHOOK_SECRET_KEY)
                .update(JSON.stringify(req.body))
                .digest('hex');
            if (`sha256=${signature}` === req.headers['x-hub-signature-256'] &&
                req.body.ref === 'refs/heads/develop') {
                res.status(200).json({ sucess: true });
                try {
                    (0, child_process_1.execSync)('git pull');
                    (0, child_process_1.execSync)('yarn');
                    (0, child_process_1.execSync)('yarn build');
                    (0, child_process_1.execSync)('git checkout yarn.lock');
                    (0, child_process_1.execSync)('pm2 restart server');
                }
                catch (err) {
                    this.logger.error(`Failed to deploy`, err);
                }
                return;
            }
        }
        return res.status(200).json({ success: false });
    }
    checkHealth() {
        return { health: 'ok' };
    }
};
__decorate([
    (0, common_1.Post)('/deploy/develop'),
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "deployDevelop", null);
__decorate([
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkHealth", null);
HealthController = HealthController_1 = __decorate([
    (0, common_1.Controller)('health')
], HealthController);
exports.HealthController = HealthController;
//# sourceMappingURL=health.controller.js.map