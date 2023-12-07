"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const messages_1 = require("../messages");
const db_service_1 = require("./db.service");
class ApiService extends db_service_1.DbService {
    async findMany(queryParams, client) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
    async findOneOrFailById(id, client) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
    getPagination(data) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
    getPaginationByField(data, field) {
        var _a;
        const dataLength = data.length;
        if (!dataLength || dataLength < this.limitRecordsPerQuery) {
            return { _next: null };
        }
        const lastData = data[dataLength - 1];
        if (lodash_1.default.isArray(field)) {
            if (!field.length) {
                return {
                    _next: null,
                };
            }
            const obj = {};
            for (const item of field) {
                obj[item] = lastData[item];
            }
            return {
                _next: this.encodeFromObj(obj),
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
    decodeToString(value) {
        return Buffer.from(value, 'base64').toString('utf-8');
    }
    decodeToObj(value) {
        const decoded = this.decodeToString(value);
        try {
            const obj = JSON.parse(decoded);
            if (!lodash_1.default.isObject(obj)) {
                throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['Input data was not correct']);
            }
            return obj;
        }
        catch (err) {
            throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['Input data was not correct']);
        }
    }
    getCursor(_cursor) {
        const cursor = this.decodeToString(_cursor);
        return cursor;
    }
}
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map