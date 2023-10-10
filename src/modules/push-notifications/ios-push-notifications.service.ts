import { Injectable } from '@nestjs/common';

import { firebase } from '../auth/firebase';

@Injectable()
export class IosPushNotificationsService {
  async send(deviceToken: string, message: { content: string; title: string }) {
    return await firebase.messaging().send({
      apns: {
        headers: {
          'apns-priority': '10',
          'apns-expiration': '360000',
        },
        payload: {
          aps: {
            alert: {
              title: message.title,
              body: message.content,
            },
            badge: 1,
            sound: 'default',
          },
        },
      },
      token: deviceToken,
    });
  }
}
