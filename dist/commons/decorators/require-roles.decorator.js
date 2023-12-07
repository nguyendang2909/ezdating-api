"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireRoles = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const RequireRoles = (roles) => {
    return (0, common_1.SetMetadata)(app_config_1.APP_CONFIG.USER_ROLES_KEY, roles);
};
exports.RequireRoles = RequireRoles;
//# sourceMappingURL=require-roles.decorator.js.map