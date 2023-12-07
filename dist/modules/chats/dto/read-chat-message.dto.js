"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadChatMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ReadChatMessageSchema = joi_1.default.object({
    lastMessageId: joi_1.default.string().required(),
    matchId: joi_1.default.string().required(),
}).options({
    allowUnknown: true,
    stripUnknown: true,
    abortEarly: true,
});
//# sourceMappingURL=read-chat-message.dto.js.map