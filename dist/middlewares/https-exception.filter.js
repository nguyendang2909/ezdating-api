"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger();
let HttpExceptionFilter = class HttpExceptionFilter {
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const { status, json } = await this.prepareException(exception);
        logger.log(`response: ${JSON.stringify({ status, json })}`);
        response.status(status).send(json);
    }
    async prepareException(exc) {
        const error = exc instanceof common_1.HttpException
            ? exc
            : new common_1.InternalServerErrorException(exc.message);
        const status = error.getStatus();
        const response = error.getResponse();
        const json = typeof response === 'string' ? { error: response } : response;
        if (process.env.NODE_ENV === 'test' ||
            process.env.NODE_ENV === 'development') {
        }
        return { status, json };
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=https-exception.filter.js.map