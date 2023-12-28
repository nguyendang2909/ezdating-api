"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = exports.delay = void 0;
__exportStar(require("./paginations"), exports);
__exportStar(require("./profiles.util"), exports);
__exportStar(require("./utils.module"), exports);
__exportStar(require("./validators"), exports);
const delay = (time = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};
exports.delay = delay;
async function retry(promiseFn, maxTries = 3) {
    try {
        return await promiseFn();
    }
    catch (err) {
        if (maxTries > 0) {
            return await this.retry(promiseFn, maxTries - 1);
        }
        throw err;
    }
}
exports.retry = retry;
//# sourceMappingURL=index.js.map