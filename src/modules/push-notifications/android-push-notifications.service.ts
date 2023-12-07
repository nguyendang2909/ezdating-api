import { Injectable } from '@nestjs/common';

import { FirebaseService } from '../../libs';

@Injectable()
export class AndroidPushNotificationsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async send(deviceToken: string, message: { content: string; title: string }) {
    return await this.firebaseService.firebase.messaging().send({
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
