import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

import { ChatsGateway } from '../../chats/chats.gateway';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { MatchWithTargetProfile } from '../../models';

@Injectable()
export class MatchesSocketEventHandler {
  constructor(private readonly chatsGateway: ChatsGateway) {}

  logger = new Logger(MatchesSocketEventHandler.name);

  emitMatchToUser(userId: string, payload: MatchWithTargetProfile) {
    this.logger.log(
      `SOCKET_EVENT Emit "${
        SOCKET_TO_CLIENT_EVENTS.MATCH
      }" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`,
    );
    this.chatsGateway.server
      .to(userId)
      .emit(SOCKET_TO_CLIENT_EVENTS.MATCH, payload);
  }

  emitUnMatchToUser(userId: string, payload: { _id: Types.ObjectId }) {
    this.logger.log(
      `SOCKET_EVENT Emit "${
        SOCKET_TO_CLIENT_EVENTS.UNMATCH
      }" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`,
    );
    this.chatsGateway.server
      .to(userId)
      .emit(SOCKET_TO_CLIENT_EVENTS.UNMATCH, payload);
  }
}
