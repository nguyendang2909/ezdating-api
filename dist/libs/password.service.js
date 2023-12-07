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
exports.PasswordsService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = __importDefault(require("bcrypt"));
let PasswordsService = class PasswordsService {
    constructor() {
        this.SECRET_KEY = process.env.HASH_SECRET_KEY;
    }
    hash(key) {
        return bcrypt_1.default.hashSync(key + this.SECRET_KEY, 10);
    }
    compare(key, hashedKey) {
        return bcrypt_1.default.compareSync(`${key}${this.SECRET_KEY}`, hashedKey);
    }
    verifyCompare(password, hashedPassword) {
        const isMatchPassword = this.compare(password, hashedPassword);
        if (!isMatchPassword) {
            throw new common_1.UnauthorizedException({
                errorCode: 'PASSWORD_IS_NOT_CORRECT',
                message: 'Password is not correct!',
            });
        }
        return isMatchPassword;
    }
};
PasswordsService = __decorate([
    (0, common_1.Injectable)()
], PasswordsService);
exports.PasswordsService = PasswordsService;
//# sourceMappingURL=password.service.js.map