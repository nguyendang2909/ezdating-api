import { Injectable, Logger } from '@nestjs/common';

import { DbService } from '../../commons/services/db.service';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { SignedDeviceModel } from '../models/signed-device.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

@Injectable()
export class ChatsHandler extends DbService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly messageModel: MessageModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {
    super();
  }

  logger = new Logger(ChatsHandler.name);
}
