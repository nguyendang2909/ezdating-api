"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationCursorDateUtil = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const messages_1 = require("../../commons/messages");
const pagination_base_util_1 = require("../bases/pagination-base.util");
let PaginationCursorDateUtil = class PaginationCursorDateUtil extends pagination_base_util_1.PaginationBaseUtil {
    getCursor(_cursor) {
        const cursor = (0, moment_1.default)(this.decode(_cursor));
        if (!cursor.isValid()) {
            throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['Input data was not correct']);
        }
        return cursor.toDate();
    }
};
PaginationCursorDateUtil = __decorate([
    (0, common_1.Injectable)()
], PaginationCursorDateUtil);
exports.PaginationCursorDateUtil = PaginationCursorDateUtil;
//# sourceMappingURL=pagination-cursor-date.util.js.map