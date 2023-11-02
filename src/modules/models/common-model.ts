import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import {
  Document,
  FilterQuery,
  HydratedDocument,
  IfAny,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  Require_id,
  ReturnsNewDoc,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';

export class CommonModel<
  TRawDocType,
  TQueryHelpers = {},
  TInstanceMethods = {},
  TVirtuals = {},
  THydratedDocumentType = HydratedDocument<
    TRawDocType,
    TVirtuals & TInstanceMethods,
    TQueryHelpers
  >,
  TSchema = any,
> {
  protected model: Model<HydratedDocument<TRawDocType>>;
  public limitRecordsPerQuery: number = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;
  protected notFoundMessage: string =
    HttpErrorMessages['Document does not exist'];

  public areObjectIdEqual(
    first: Types.ObjectId,
    second: Types.ObjectId,
  ): boolean {
    return first.toString() === second.toString();
  }

  async aggregate(
    pipeline: PipelineStage[],
  ): Promise<Array<TRawDocType & { _id: Types.ObjectId }>> {
    return await this.model.aggregate(pipeline).exec();
  }

  async createOne(doc: Partial<TRawDocType>) {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
  }

  findMany(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null | undefined,
    options?: QueryOptions<TRawDocType> | null | undefined,
  ) {
    return this.model
      .find(filter, projection, {
        lean: true,
        ...options,
      })
      .exec();
  }

  async findOne(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<TRawDocType | null> {
    if (_.isEmpty(filter)) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.model
      .findOne(filter, projection, { lean: true, ...options })
      .exec();
  }

  async findOneOrFail(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return findResult;
  }

  async findOneAndFail(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<TRawDocType> {
    const findResult = await this.findOne(filter, projection, options);
    return this.verifyExist(findResult);
  }

  async findOneById(
    _id: Types.ObjectId,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<TRawDocType | null> {
    return await this.findOne({ _id }, projection, options);
  }

  async findOneOrFailById(
    _id: Types.ObjectId,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<TRawDocType> {
    const findResult = await this.findOneById(_id, projection, options);
    return this.verifyExist(findResult);
  }

  async updateOne(
    filter: FilterQuery<TRawDocType>,
    update: UpdateQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<UpdateWriteOpResult> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return await this.model.updateOne(filter, update, options);
  }

  async updateOneById(
    _id: Types.ObjectId,
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<UpdateWriteOpResult> {
    return await this.updateOne({ _id }, update, options);
  }

  async updateOneOrFail(
    filter: FilterQuery<TRawDocType>,
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<void> {
    const updateResult = await this.updateOne(filter, update, options);
    if (!updateResult.modifiedCount) {
      throw new InternalServerErrorException(
        HttpErrorMessages['Update failed. Please try again.'],
      );
    }
  }

  async updateOneOrFailById(
    _id: Types.ObjectId,
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<void> {
    return await this.updateOneOrFail({ _id }, update, options);
  }

  async findOneAndUpdate(
    filter: FilterQuery<TRawDocType>,
    update: UpdateQuery<
      IfAny<
        TRawDocType,
        any,
        Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>
      >
    >,
    options?:
      | (QueryOptions<TRawDocType> & {
          upsert?: true;
        } & Partial<ReturnsNewDoc> & {
            rawResult?: true;
          })
      | null,
  ) {
    return await this.model
      .findOneAndUpdate(filter, update, { lean: true, ...options })
      .exec();
  }

  async findOneAndUpdateById(
    _id: Types.ObjectId,
    update: UpdateQuery<
      IfAny<
        TRawDocType,
        any,
        Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>
      >
    >,
    options?:
      | (QueryOptions<TRawDocType> & {
          upsert?: true;
        } & Partial<ReturnsNewDoc> & {
            rawResult?: true;
          })
      | null,
  ) {
    return await this.model
      .findOneAndUpdate({ _id }, update, { lean: true, ...options })
      .exec();
  }

  async deleteOne(
    filter?: FilterQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType>,
  ) {
    return await this.model.deleteOne(filter, options).exec();
  }

  async deleteOneById(
    _id: Types.ObjectId,
    options?: QueryOptions<TRawDocType>,
  ) {
    return await this.deleteOne({ _id }, options);
  }

  async deleteOneOrFail(
    filter?: FilterQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType>,
  ) {
    const deteResult = await this.deleteOne(filter, options);
    if (!deteResult.deletedCount) {
      throw new InternalServerErrorException(
        HttpErrorMessages['Delete failed. Please try again.'],
      );
    }
  }

  verifyExist(e: any) {
    if (!e) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return e;
  }
}
