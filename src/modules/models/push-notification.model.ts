import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongoDocument } from '../../commons/types';
import { CommonModel } from './common-model';
import {
  PushNotification,
  PushNotificationDocument,
} from './schemas/push-notification.schema';
import { UserModel } from './user.model';

@Injectable()
export class PushNotificationModel extends CommonModel {
  constructor(
    @InjectModel(PushNotification.name)
    public readonly pushNotificationModel: Model<
      MongoDocument<PushNotificationDocument>
    >,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  async createOne(
    payload: Partial<PushNotification>,
  ): Promise<PushNotificationDocument> {
    const result = await this.pushNotificationModel.create(payload);
    return result.toJSON();
  }
}
