"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
class CommonService {
    constructor() {
        this.logger = new common_1.Logger('Service');
    }
}
exports.CommonService = CommonService;
//# sourceMappingURL=common.service.js.map