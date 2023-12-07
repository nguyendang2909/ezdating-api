"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonConsumer = void 0;
const mongoose_1 = require("mongoose");
class CommonConsumer {
    getObjectId(id) {
        return new mongoose_1.Types.ObjectId(id);
    }
}
exports.CommonConsumer = CommonConsumer;
//# sourceMappingURL=common.consumer.js.map