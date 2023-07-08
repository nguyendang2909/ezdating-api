import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { MessageEntity } from '../messages/message-entity.service';
import { RelationshipEntity } from '../relationships/relationship-entity.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly messageEntity: MessageEntity,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { targetUserId, text, uuid } = payload;
    const currentUserId = socket.handshake.user.id;
    if (targetUserId === currentUserId) {
      socket.emit('error', {
        errorCode: HttpErrorCodes.CONFLICT_USER,
        message: 'You cannot message yourself!',
      });
    }
    const userIds = this.relationshipEntity.sortUserIds(
      currentUserId,
      targetUserId,
    );
    const relationshipId =
      this.relationshipEntity.getIdFromSortedUserIds(userIds);
    const existRelationship = this.relationshipEntity.findOneConversationById(
      relationshipId,
      currentUserId,
    );
    if (!existRelationship) {
      socket.emit('error', {
        errorCode: HttpErrorCodes.RELATIONSHIP_DOES_NOT_EXIST,
        message: 'Relationship does not exist!',
      });
    }
    const messageCreatedAt = moment().toDate();
    const [message] = await Promise.all([
      this.messageEntity.saveOne(
        {
          user: { id: currentUserId },
          relationship: { id: relationshipId },
          text,
          uuid,
          createdAt: messageCreatedAt,
        },
        currentUserId,
      ),
      this.relationshipEntity.updateOneById(
        relationshipId,
        {
          lastMessageAt: messageCreatedAt,
          lastMessage: text,
        },
        currentUserId,
      ),
    ]);
    socket.emit('updateMsg', message);
    socket.to([currentUserId, targetUserId]).emit('msg', message);
  }
}
