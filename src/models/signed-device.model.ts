import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages/error-messages.constant';
import { CommonModel } from './bases/common-model';
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
    this.conflictMessage = ERROR_MESSAGES['User device already exists'];
    this.notFoundMessage = ERROR_MESSAGES['User device does not exist'];
  }
}
