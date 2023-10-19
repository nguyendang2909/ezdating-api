import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import {
  Document,
  FilterQuery,
  FlattenMaps,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';
import { Types } from 'mongoose';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
import {
  SignedDevice,
  SignedDeviceDocument,
} from './schemas/signed-device.schema';

@Injectable()
export class SignedDeviceModel extends CommonModel<SignedDevice> {
  constructor(
    @InjectModel(SignedDevice.name)
    public readonly model: Model<SignedDeviceDocument>,
  ) {
    super();
  }

  async createOne(
    doc: Partial<SignedDevice>,
  ): Promise<
    FlattenMaps<
      Document<unknown, {}, SignedDevice> &
        SignedDevice & { _id: Types.ObjectId }
    >
  > {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
  }

  async findOne(
    filter?: FilterQuery<any> | undefined,
    projection?: ProjectionType<any> | null | undefined,
    options?: QueryOptions<any> | null | undefined,
  ): Promise<null | FlattenMaps<
    Document<unknown, {}, SignedDevice> & SignedDevice & { _id: Types.ObjectId }
  >> {
    if (_.isEmpty(filter)) {
      return null;
    }
    return await this.model.findOne(filter, projection, options).lean().exec();
  }

  // public async findOne(
  //   filter: FilterQuery<SignedDeviceDocument>,
  //   projection?: ProjectionType<SignedDeviceDocument> | null,
  //   options?: QueryOptions<SignedDeviceDocument> | null,
  // ) {
  //   if (_.isEmpty(filter)) {
  //     return null;
  //   }
  //   return await this.model.findOne(filter, projection, options).lean().exec();
  // }

  public async findOneOrFail(
    filter: FilterQuery<SignedDeviceDocument>,
    projection?: ProjectionType<SignedDeviceDocument> | null,
    options?: QueryOptions<SignedDeviceDocument> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        message: HttpErrorMessages['User device does not exist.'],
      });
    }

    return findResult;
  }

  // public async findMany(
  //   filter: FilterQuery<SignedDeviceDocument>,
  //   projection?: ProjectionType<SignedDeviceDocument> | null | undefined,
  //   options?: QueryOptions<SignedDeviceDocument> | null | undefined,
  // ) {
  //   return await this.model
  //     .find(filter, projection, {
  //       limit: APP_CONFIG.PAGINATION_LIMIT.SIGNED_DEVICES,
  //       ...options,
  //     })
  //     .lean()
  //     .exec();
  // }
  async updateOne(
    filter?: FilterQuery<SignedDevice> | undefined,
    update?:
      | UpdateWithAggregationPipeline
      | UpdateQuery<SignedDevice>
      | undefined,
    options?: QueryOptions<SignedDevice> | null | undefined,
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, update, options).exec();
  }

  async updateOneOrFail(
    filter?: FilterQuery<SignedDevice> | undefined,
    update?:
      | UpdateWithAggregationPipeline
      | UpdateQuery<SignedDevice>
      | undefined,
    options?: QueryOptions<SignedDevice> | null | undefined,
  ): Promise<void> {
    const updateResult = await this.updateOne(filter, update, options);
    if (!updateResult.modifiedCount) {
      throw new BadRequestException(
        HttpErrorMessages['Update failed. Please try again.'],
      );
    }
  }

  public async updateOneById(
    _id: Types.ObjectId,
    updateOptions: UpdateQuery<SignedDeviceDocument>,
  ): Promise<boolean> {
    const updateResult = await this.model.updateOne({ _id }, updateOptions);

    return !!updateResult.modifiedCount;
  }
}
