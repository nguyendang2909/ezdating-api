import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import { Socket } from 'socket.io';

import { SocketBaseService } from '../../commons';
import { USER_STATUSES } from '../../constants';
import { AccessTokensService } from '../../libs';
import { UserModel } from '../models/user.model';

@Injectable()
export class ChatsConnectionService extends SocketBaseService {
  constructor(
    private readonly acessTokensService: AccessTokensService,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  logger = new Logger(ChatsConnectionService.name);

  public async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.query.token;
      if (!token || !_.isString(token)) {
        socket.disconnect();

        return;
      }
      const clientData = this.acessTokensService.verify(token);
      const { id: userId } = clientData;
      const _currentUserId = this.getObjectId(userId);
      const user = await this.userModel.findOneOrFail({ _id: _currentUserId });
      if (!user || user.status === USER_STATUSES.BANNED) {
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
