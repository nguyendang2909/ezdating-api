import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import { Socket } from 'socket.io';

import { UserStatuses } from '../../commons/constants';
import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { UserModel } from '../models/user.model';

@Injectable()
export class ChatsConnectionService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly userModel: UserModel,
  ) {}

  private readonly logger = new Logger(ChatsConnectionService.name);

  public async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.query.token;
      if (!token || !_.isString(token)) {
        socket.disconnect();

        return;
      }
      const clientData = this.encryptionsUtil.verifyAccessToken(token);
      const { id: userId } = clientData;
      const _currentUserId = this.userModel.getObjectId(userId);
      const user = await this.userModel.findOneOrFail({ _id: _currentUserId });
      if (!user || user.status === UserStatuses.banned) {
        socket.disconnect();

        return;
      }
      socket.handshake.user = clientData;
      socket.join(userId);
      this.logger.log(`Socket connected: ${socket.id}`);

      return;
    } catch (err) {
      socket.disconnect();
    }
  }
}
