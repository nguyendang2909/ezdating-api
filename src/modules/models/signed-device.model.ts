import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { Types } from 'mongoose';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
import {
  SignedDevice,
  SignedDeviceDocument,
} from './schemas/signed-device.schema';

@Injectable()
export class SignedDeviceModel extends CommonModel {
  constructor(
    @InjectModel(SignedDevice.name)
    public readonly model: Model<SignedDeviceDocument>,
  ) {
    super();
  }

  public async createOne(entity: Partial<SignedDevice>) {
    const user = await this.model.create(entity);

    return user.toJSON();
  }

  public async findOne(
    filter: FilterQuery<SignedDeviceDocument>,
    projection?: ProjectionType<SignedDeviceDocument> | null,
    options?: QueryOptions<SignedDeviceDocument> | null,
  ) {
    if (_.isEmpty(filter)) {
      return null;
    }
    return await this.model.findOne(filter, projection, options).lean().exec();
  }

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

  public async updateOneById(
    _id: Types.ObjectId,
    updateOptions: UpdateQuery<SignedDeviceDocument>,
  ): Promise<boolean> {
    const updateResult = await this.model.updateOne({ _id }, updateOptions);

    return !!updateResult.modifiedCount;
  }
}
