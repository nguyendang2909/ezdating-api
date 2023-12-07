"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("mongoose");
const error_messages_constant_1 = require("../../commons/messages/error-messages.constant");
const common_model_1 = require("./bases/common-model");
const match_schema_1 = require("./schemas/match.schema");
let MatchModel = class MatchModel extends common_model_1.CommonModel {
    constructor(model) {
        super();
        this.model = model;
        this.conflictMessage = error_messages_constant_1.ERROR_MESSAGES['Match already exists'];
        this.notFoundMessage = error_messages_constant_1.ERROR_MESSAGES['Match does not exist'];
    }
    getSortedUserIds({ currentUserId, targetUserId, }) {
        const sortedUserIds = [currentUserId, targetUserId].sort();
        const userOneId = sortedUserIds[0];
        const userTwoId = sortedUserIds[1];
        return {
            sortedUserIds,
            isUserOne: sortedUserIds[0] === currentUserId,
            userOneId,
            userTwoId,
            _userOneId: new mongoose_3.Types.ObjectId(userOneId),
            _userTwoId: new mongoose_3.Types.ObjectId(userTwoId),
        };
    }
    isUserOne({ currentUserId, userOneId, }) {
        return currentUserId === userOneId;
    }
    getTargetUserId({ currentUserId, userOneId, userTwoId, }) {
        if (this.isUserOne({ currentUserId, userOneId })) {
            return {
                targetUserId: userTwoId,
                _targetUserId: new mongoose_3.Types.ObjectId(userTwoId),
                isUserOne: true,
            };
        }
        return {
            targetUserId: userOneId,
            _targetUserId: new mongoose_3.Types.ObjectId(userOneId),
            isUserOne: false,
        };
    }
    formatManyWithTargetProfile(matches, currentUserId) {
        return matches.map((e) => {
            return this.formatOneWithTargetProfile(e, this.isUserOne({
                currentUserId,
                userOneId: e.profileOne._id.toString(),
            }));
        });
    }
    formatOneWithTargetProfile(match, isUserOne) {
        const { profileOne, profileTwo, userOneRead, userTwoRead } = match, restE = __rest(match, ["profileOne", "profileTwo", "userOneRead", "userTwoRead"]);
        return Object.assign(Object.assign({}, restE), { read: isUserOne ? userOneRead : userTwoRead, targetProfile: isUserOne ? profileTwo : profileOne });
    }
    queryUserOneOrUserTwo(_currentUserId) {
        return {
            $or: [
                { 'profileOne._id': _currentUserId },
                { 'profileTwo._id': _currentUserId },
            ],
        };
    }
};
MatchModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(match_schema_1.Match.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MatchModel);
exports.MatchModel = MatchModel;
//# sourceMappingURL=match.model.js.map