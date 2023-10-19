import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

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
    readonly model: Model<SignedDeviceDocument>,
  ) {
    super();
  }

  public async findOneOrFail(
    filter: FilterQuery<SignedDeviceDocument>,
    projection?: ProjectionType<SignedDeviceDocument> | null,
    options?: QueryOptions<SignedDeviceDocument> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        message: HttpErrorMessages['User device does not exist'],
      });
    }

    return findResult;
  }
}
