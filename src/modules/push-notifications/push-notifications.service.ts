import { Injectable } from '@nestjs/common';

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
    if (payload.platform === DevicePlatforms.ios) {
      await this.iosService.send(payload.deviceId, {
        title: payload.title,
        content: payload.content,
      });

      return;
    }

    if (payload.platform === DevicePlatforms.android) {
      await this.androidService.send(payload.deviceId, {
        title: payload.title,
        content: payload.content,
      });

      return;
    }
  }

  async sendByDevices(
    payload: SendPushNotificationContent,
    devices: SignedDevice[],
  ) {
    await Promise.all(
      devices
        .map((e) => {
          if (!e.deviceId || !e.platform) {
            return;
          }
          return this.send({
            content: payload.content,
            title: 'You have received new message',
            deviceId: e.deviceId,
            platform: e.platform,
          });
        })
        .filter((e) => !!e),
    );
  }
}
