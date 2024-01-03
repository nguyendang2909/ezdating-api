import { Socket } from 'socket.io';

import { DbBaseService } from '../db/db.base.service';

export class SocketBaseService extends DbBaseService {
  getClient(socket: Socket) {
    const { id: currentUserId } = socket.handshake.user;
    const _currentUserId = this.getObjectId(currentUserId);
    return { currentUserId, _currentUserId };
  }
}
