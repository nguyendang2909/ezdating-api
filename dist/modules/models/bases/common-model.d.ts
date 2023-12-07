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
import { AnyObject, Document, FilterQuery, HydratedDocument, IfAny, Model, PipelineStage, ProjectionType, QueryOptions, Require_id, ReturnsNewDoc, Types, UpdateQuery, UpdateWithAggregationPipeline, UpdateWriteOpResult } from 'mongoose';
import { ErrorMessage } from '../../../types';
export declare class CommonModel<TRawDocType, TQueryHelpers = {}, TInstanceMethods = {}, TVirtuals = {}, THydratedDocumentType = HydratedDocument<TRawDocType, TVirtuals & TInstanceMethods, TQueryHelpers>, TSchema = any> {
    protected model: Model<HydratedDocument<TRawDocType>>;
    protected notFoundMessage: ErrorMessage;
    protected conflictMessage: string;
    protected deleteFailMessage: ErrorMessage;
    protected updateFailMessage: ErrorMessage;
    areObjectIdEqual(first: Types.ObjectId, second: Types.ObjectId): boolean;
    aggregate(pipeline: PipelineStage[]): Promise<Array<TRawDocType & {
        _id: Types.ObjectId;
    }>>;
    aggregateExplain(pipeline: PipelineStage[]): Promise<AnyObject>;
    createOne(doc: Partial<TRawDocType>): Promise<import("mongoose").FlattenMaps<Require_id<IfAny<TRawDocType, any, Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>>>>>;
    findMany(filter: FilterQuery<TRawDocType>, projection?: ProjectionType<TRawDocType> | null | undefined, options?: QueryOptions<TRawDocType> | null | undefined): Promise<IfAny<IfAny<TRawDocType, any, Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>>, any, Document<unknown, {}, IfAny<TRawDocType, any, Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>>> & Require_id<IfAny<TRawDocType, any, Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>>>>[]>;
    findOne(filter: FilterQuery<TRawDocType>, projection?: ProjectionType<TRawDocType> | null, options?: QueryOptions<TRawDocType> | null): Promise<TRawDocType | null>;
    findOneOrFail(filter: FilterQuery<TRawDocType>, projection?: ProjectionType<TRawDocType> | null, options?: QueryOptions<TRawDocType> | null): Promise<NonNullable<Awaited<TRawDocType>>>;
    findOneAndFail(filter: FilterQuery<TRawDocType>, projection?: ProjectionType<TRawDocType> | null, options?: QueryOptions<TRawDocType> | null): Promise<void>;
    findOneById(_id: Types.ObjectId, projection?: ProjectionType<TRawDocType> | null, options?: QueryOptions<TRawDocType> | null): Promise<TRawDocType | null>;
    findOneOrFailById(_id: Types.ObjectId, projection?: ProjectionType<TRawDocType> | null, options?: QueryOptions<TRawDocType> | null): Promise<TRawDocType>;
    findOneAndFailById(_id: Types.ObjectId, projection?: ProjectionType<TRawDocType> | null, options?: QueryOptions<TRawDocType> | null): Promise<void>;
    updateOne(filter: FilterQuery<TRawDocType>, update: UpdateQuery<TRawDocType>, options?: QueryOptions<TRawDocType> | null): Promise<UpdateWriteOpResult>;
    updateOneById(_id: Types.ObjectId, update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline, options?: QueryOptions<TRawDocType> | null): Promise<UpdateWriteOpResult>;
    updateOneOrFail(filter: FilterQuery<TRawDocType>, update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline, options?: QueryOptions<TRawDocType> | null): Promise<void>;
    updateOneOrFailById(_id: Types.ObjectId, update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline, options?: QueryOptions<TRawDocType> | null): Promise<void>;
    findOneAndUpdate(filter: FilterQuery<TRawDocType>, update: UpdateQuery<IfAny<TRawDocType, any, Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>>>, options?: (QueryOptions<TRawDocType> & {
        upsert?: true;
    } & Partial<ReturnsNewDoc> & {
        rawResult?: true;
    }) | null): Promise<TRawDocType | null>;
    findOneAndUpdateById(_id: Types.ObjectId, update: UpdateQuery<IfAny<TRawDocType, any, Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>>>, options?: (QueryOptions<TRawDocType> & {
        upsert?: true;
    } & Partial<ReturnsNewDoc> & {
        rawResult?: true;
    }) | null): Promise<TRawDocType | null>;
    deleteMany(filter: FilterQuery<TRawDocType>, options?: QueryOptions<TRawDocType>): Promise<import("mongodb").DeleteResult>;
    deleteOne(filter: FilterQuery<TRawDocType>, options?: QueryOptions<TRawDocType>): Promise<import("mongodb").DeleteResult>;
    deleteOneOrFail(filter: FilterQuery<TRawDocType>, options?: QueryOptions<TRawDocType>): Promise<void>;
    verifyExist(e: any): any;
    verifyNotExist(e: any): void;
    verifyDeleteSuccess(deleteResult: any): void;
    verifyUpdateSuccess(updateResult: any): void;
}
