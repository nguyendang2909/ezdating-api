import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import {
  SendPushNotificationContent,
  SendPushNotificationPayload,
} from '../../commons';
import { DevicePlatforms } from '../../commons/constants';
import { SignedDevice } from '../models/schemas/signed-device.schema';
import { SignedDeviceModel } from '../models/signed-device.model';
import { AndroidPushNotificationsService } from './android-push-notifications.service';
import { IosPushNotificationsService } from './ios-push-notifications.service';

@Injectable()
export class PushNotificationsService {
  constructor(
    private readonly iosService: IosPushNotificationsService,
    private readonly androidService: AndroidPushNotificationsService,
    private readonly signedDeviceModel: SignedDeviceModel,
  ) {}

  async send(payload: SendPushNotificationPayload) {
    if (payload.devicePlatform === DevicePlatforms.ios) {
      return await this.iosService.send(payload.deviceToken, {
        title: payload.title,
        content: payload.content,
      });
    }

    if (payload.devicePlatform === DevicePlatforms.android) {
      await this.androidService.send(payload.deviceToken, {
        title: payload.title,
        content: payload.content,
      });
    }
  }

  async sendByDevices(
    devices: SignedDevice[],
    payload: SendPushNotificationContent,
  ) {
    return await Promise.all(
      devices
        .map((e) => {
          if (!e.token || !e.platform) {
            return;
          }
          return this.send({
            content: payload.content,
            title: 'You have received new message',
            deviceToken: e.token,
            devicePlatform: e.platform,
          });
        })
        .filter((e) => !!e),
    );
  }

  async sendByUserId(
    _userId: Types.ObjectId,
    payload: SendPushNotificationContent,
  ) {
    const devices = await this.signedDeviceModel.model
      .find(
        {
          _userId,
          token: {
            $exists: true,
          },
        },
        {},
        { lean: true },
      )
      .exec();

    return await this.sendByDevices(devices, payload);
  }
}
