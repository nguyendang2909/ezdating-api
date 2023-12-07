"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModel = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const messages_1 = require("../../../commons/messages");
class CommonModel {
    constructor() {
        this.notFoundMessage = messages_1.ERROR_MESSAGES['Document does not exist'];
        this.conflictMessage = messages_1.ERROR_MESSAGES['Document already exists'];
        this.deleteFailMessage = messages_1.ERROR_MESSAGES['Delete failed. Please try again.'];
        this.updateFailMessage = messages_1.ERROR_MESSAGES['Update failed. Please try again.'];
    }
    areObjectIdEqual(first, second) {
        return first.toString() === second.toString();
    }
    async aggregate(pipeline) {
        return await this.model.aggregate(pipeline).exec();
    }
    async aggregateExplain(pipeline) {
        return await this.model.aggregate(pipeline).explain();
    }
    async createOne(doc) {
        const createResult = await this.model.create(doc);
        return createResult.toJSON();
    }
    findMany(filter, projection, options) {
        return this.model
            .find(filter, projection, Object.assign({ lean: true }, options))
            .exec();
    }
    async findOne(filter, projection, options) {
        if (lodash_1.default.isEmpty(filter)) {
            return null;
        }
        return this.model
            .findOne(filter, projection, Object.assign({ lean: true }, options))
            .exec();
    }
    async findOneOrFail(filter, projection, options) {
        const findResult = await this.findOne(filter, projection, options);
        if (!findResult) {
            throw new common_1.NotFoundException(this.notFoundMessage);
        }
        return findResult;
    }
    async findOneAndFail(filter, projection, options) {
        const findResult = await this.findOne(filter, projection, options);
        this.verifyNotExist(findResult);
    }
    async findOneById(_id, projection, options) {
        return await this.findOne({ _id }, projection, options);
    }
    async findOneOrFailById(_id, projection, options) {
        return await this.findOneOrFail({ _id }, projection, options);
    }
    async findOneAndFailById(_id, projection, options) {
        return await this.findOneAndFail({ _id }, projection, options);
    }
    async updateOne(filter, update, options) {
        return await this.model.updateOne(filter, update, options);
    }
    async updateOneById(_id, update, options) {
        return await this.updateOne({ _id }, update, options);
    }
    async updateOneOrFail(filter, update, options) {
        const updateResult = await this.updateOne(filter, update, options);
        this.verifyUpdateSuccess(updateResult);
    }
    async updateOneOrFailById(_id, update, options) {
        const updateResult = await this.updateOneById(_id, update, options);
        this.verifyUpdateSuccess(updateResult);
    }
    async findOneAndUpdate(filter, update, options) {
        return await this.model
            .findOneAndUpdate(filter, update, Object.assign({ lean: true }, options))
            .exec();
    }
    async findOneAndUpdateById(_id, update, options) {
        return await this.findOneAndUpdate({ _id }, update, options);
    }
    async deleteMany(filter, options) {
        return await this.model.deleteMany(filter, options);
    }
    async deleteOne(filter, options) {
        return await this.model.deleteOne(filter, options).exec();
    }
    async deleteOneOrFail(filter, options) {
        const deleteResult = await this.deleteOne(filter, options);
        this.verifyDeleteSuccess(deleteResult);
    }
    verifyExist(e) {
        if (!e) {
            throw new common_1.NotFoundException(this.notFoundMessage);
        }
        return e;
    }
    verifyNotExist(e) {
        if (e) {
            throw new common_1.ConflictException(this.conflictMessage);
        }
    }
    verifyDeleteSuccess(deleteResult) {
        if (!deleteResult.deletedCount) {
            throw new common_1.BadRequestException(this.deleteFailMessage);
        }
    }
    verifyUpdateSuccess(updateResult) {
        if (!updateResult.modifiedCount) {
            throw new common_1.BadRequestException(this.updateFailMessage);
        }
    }
}
exports.CommonModel = CommonModel;
//# sourceMappingURL=common-model.js.map