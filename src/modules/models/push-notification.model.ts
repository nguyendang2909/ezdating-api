import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './bases/common-model';
import {
  PushNotification,
  PushNotificationDocument,
} from './schemas/push-notification.schema';
import { UserModel } from './user.model';

@Injectable()
export class PushNotificationModel extends CommonModel<PushNotification> {
  constructor(
    @InjectModel(PushNotification.name)
    readonly model: Model<PushNotificationDocument>,
    private readonly userModel: UserModel,
  ) {
    super();
  }
}
