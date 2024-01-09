import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { DEVICE_PLATFORMS } from '../../constants';
import {
  SendPushNotificationByProfileOptions,
  SendPushNotificationContent,
  SendPushNotificationPayload,
} from '../../types';
import { Profile } from '../../models';
import { SignedDevice } from '../../models/schemas/signed-device.schema';
import { SignedDeviceModel } from '../../models/signed-device.model';
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
    if (payload.devicePlatform === DEVICE_PLATFORMS.IOS) {
      return await this.iosService.send(payload.deviceToken, {
        title: payload.title,
        content: payload.content,
      });
    }

    if (payload.devicePlatform === DEVICE_PLATFORMS.ANDROID) {
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
    const devices = await this.signedDeviceModel.findMany({
      _userId,
      token: {
        $exists: true,
      },
    });
    return await this.sendByDevices(devices, payload);
  }

  async sendByProfile(
    profile: Profile,
    payload: SendPushNotificationContent,
    options: SendPushNotificationByProfileOptions = {},
  ) {
    const recentActive = !!options.recentActive;
    if (recentActive && !this.canPushByProfile(profile)) {
      return;
    }
    const devices = await this.signedDeviceModel.findMany({
      _userId: profile._id,
      token: {
        $exists: true,
      },
    });
    return await this.sendByDevices(devices, payload);
  }

  canPushByProfile(profile: Profile) {
    return (
      !!profile.lastActivatedAt &&
      moment().diff(profile.lastActivatedAt, 'days') <=
        APP_CONFIG.PROFIFLE.LOW_ACTIVITY.MINIMUM_INACTIVITY_DATE
    );
  }
}
