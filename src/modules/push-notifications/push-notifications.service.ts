import { Injectable } from '@nestjs/common';

@Injectable()
export class PushNotificationsService {
  create(createPushNotificationDto) {}

  findAll() {
    return `This action returns all pushNotifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pushNotification`;
  }

  update(id: number, updatePushNotificationDto) {
    return `This action updates a #${id} pushNotification`;
  }

  remove(id: number) {
    return `This action removes a #${id} pushNotification`;
  }
}
