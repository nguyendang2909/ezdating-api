"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationBaseUtil = void 0;
const lodash_1 = __importDefault(require("lodash"));
class PaginationBaseUtil {
    getCursor(_cursor) {
        return this.decode(_cursor);
    }
    decode(e) {
        return Buffer.from(e, 'base64').toString('utf-8');
    }
    encodeCursor(e) {
        return this.encodeFromString(e);
    }
    getPaginationByField(data, field, limitRecordsPerQuery) {
        var _a;
        const dataLength = data.length;
        if (!dataLength || dataLength < limitRecordsPerQuery) {
            return { _next: null };
        }
        const lastData = data[dataLength - 1];
        if (lodash_1.default.isArray(field)) {
            return {
                _next: field.length
                    ? this.encodeFromObj(lodash_1.default.pick(lastData, field))
                    : null,
            };
        }
        const lastField = (_a = lastData[field]) === null || _a === void 0 ? void 0 : _a.toString();
        return {
            _next: lastField ? this.encodeFromString(lastField) : null,
        };
    }
    encodeFromString(value) {
        return Buffer.from(value, 'utf-8').toString('base64');
    }
    encodeFromObj(value) {
        return this.encodeFromString(JSON.stringify(value));
    }
}
exports.PaginationBaseUtil = PaginationBaseUtil;
//# sourceMappingURL=pagination-base.util.js.map