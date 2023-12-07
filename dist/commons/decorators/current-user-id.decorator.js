"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const common_1 = require("@nestjs/common");
exports.Client = (0, common_1.createParamDecorator)((data, ctx) => {
    const { user } = ctx.switchToHttp().getRequest();
    if (!user) {
        throw new common_1.BadRequestException('Access token payload does not exist!');
    }
    return user;
});
//# sourceMappingURL=current-user-id.decorator.js.map