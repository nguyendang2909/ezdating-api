import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import { Socket } from 'socket.io';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { UserModel } from '../entities/users.model';
import { UserStatuses } from '../users/users.constant';

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
      const decodedToken = this.encryptionsUtil.verifyAccessToken(token);
      const user = await this.userModel.findOneById(decodedToken.id);
      if (!user || user.status === UserStatuses.banned) {
        socket.disconnect();

        return;
      }
      socket.handshake.user = user;
      socket.join(user.id);
      this.logger.log(`Socket connected: ${socket.id}`);

      return;
    } catch (err) {
      socket.disconnect();
    }
  }
}
