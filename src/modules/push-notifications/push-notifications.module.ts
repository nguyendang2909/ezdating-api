import { Module } from '@nestjs/common';

import { AndroidPushNotificationsService } from './android-push-notifications.service';
import { IosPushNotificationsService } from './ios-push-notifications.service';
import { PushNotificationsService } from './push-notifications.service';

@Module({
  providers: [
    PushNotificationsService,
    AndroidPushNotificationsService,
    IosPushNotificationsService,
  ],
  exports: [PushNotificationsService],
})
export class PushNotificationsModule {}
