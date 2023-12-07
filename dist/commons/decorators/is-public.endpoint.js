"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPublicEndpoint = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const IsPublicEndpoint = () => (0, common_1.SetMetadata)(app_config_1.APP_CONFIG.PUBLIC_ENDPOINT_METADATA, true);
exports.IsPublicEndpoint = IsPublicEndpoint;
//# sourceMappingURL=is-public.endpoint.js.map