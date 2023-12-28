"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationCursorNumberUtil = void 0;
const common_1 = require("@nestjs/common");
const pagination_base_util_1 = require("../bases/pagination-base.util");
let PaginationCursorNumberUtil = class PaginationCursorNumberUtil extends pagination_base_util_1.PaginationBaseUtil {
    getCursor(_cursor) {
        const cursor = this.decode(_cursor);
        return +cursor;
    }
};
PaginationCursorNumberUtil = __decorate([
    (0, common_1.Injectable)()
], PaginationCursorNumberUtil);
exports.PaginationCursorNumberUtil = PaginationCursorNumberUtil;
//# sourceMappingURL=pagination-cursor-number.util.js.map