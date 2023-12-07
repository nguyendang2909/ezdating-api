/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { SignInPayload } from '../../types';
import { CommonModel } from './bases/common-model';
import { User, UserDocument } from './schemas/user.schema';
export declare class UserModel extends CommonModel<User> {
    readonly model: Model<UserDocument>;
    constructor(model: Model<UserDocument>);
    private readonly logger;
    createOne(doc: Partial<User>): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: Types.ObjectId;
    }>>>;
    create(doc: Partial<User>): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: Types.ObjectId;
    }>>>;
    findOneOrFail(filter: FilterQuery<User>, projection?: ProjectionType<User> | null, options?: QueryOptions<User> | null): Promise<User>;
    findOneOrFailById(_id: Types.ObjectId, projection?: ProjectionType<User> | null, options?: QueryOptions<User> | null): Promise<User>;
    findOneOrCreate(payload: SignInPayload): Promise<User>;
    verifyValid(user: User): User;
    verifySignInPayload(payload: SignInPayload): SignInPayload;
}
