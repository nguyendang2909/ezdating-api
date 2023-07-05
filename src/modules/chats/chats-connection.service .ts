import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { UserStatuses } from '../users/users.constant';
import { UserEntity } from '../users/users-entity.service';

@Injectable()
export class ChatsConnectionService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly userEntity: UserEntity,
  ) {}

  private readonly logger = new Logger(ChatsConnectionService.name);

  public async handleConnection(socket: Socket) {
    try {
      const { authorization } = socket.handshake.headers;
      const token = authorization?.split(' ')[1];
      if (!token) {
        socket.disconnect();

        return;
      }
      const decodedToken = this.encryptionsUtil.verifyJwt(token);
      const user = await this.userEntity.findOneById(decodedToken.id);
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
