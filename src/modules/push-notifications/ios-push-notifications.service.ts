import { Injectable } from '@nestjs/common';

import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class IosPushNotificationsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async send(deviceToken: string, message: { content: string; title: string }) {
    return await this.firebaseService.app.messaging().send({
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
