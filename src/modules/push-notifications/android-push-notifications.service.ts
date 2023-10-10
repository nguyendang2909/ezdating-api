import { Injectable } from '@nestjs/common';

import { firebase } from '../auth/firebase';

@Injectable()
export class AndroidPushNotificationsService {
  async send(deviceToken: string, message: { content: string; title: string }) {
    return await firebase.messaging().send({
      android: {
        priority: 'normal',
        ttl: 360000,
        data: {
          title: message.title,
          content: message.content,
        },
      },
      token: deviceToken,
    });
  }
}
