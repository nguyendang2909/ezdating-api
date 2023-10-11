import { Injectable } from '@nestjs/common';

import { SendPushNotificationPayload } from '../../commons';
import { DevicePlatforms } from '../../commons/constants';
import { AndroidPushNotificationsService } from './android-push-notifications.service';
import { IosPushNotificationsService } from './ios-push-notifications.service';

@Injectable()
export class PushNotificationsService {
  constructor(
    private readonly iosService: IosPushNotificationsService,
    private readonly androidService: AndroidPushNotificationsService,
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
}
