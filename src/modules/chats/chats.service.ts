import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { MessageEntity } from '../messages/message-entity.service';
import { RelationshipEntity } from '../relationships/relationship-entity.service';
import { UserEntity } from '../users/users-entity.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly messageEntity: MessageEntity,
    private readonly userEntity: UserEntity,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { relationshipId, text, uuid } = payload;
    const currentUserId = socket.handshake.user.id;
    const existRelationship = this.relationshipEntity.findOneConversationById(
      relationshipId,
      currentUserId,
    );
    if (!existRelationship) {
      socket.emit('error', {
        errorCode: HttpErrorCodes.RELATIONSHIP_DOES_NOT_EXIST,
        message: 'Relationship does not exist!',
      });
      return;
    }
    const messageCreatedAt = moment().toDate();
    const [message] = await Promise.all([
      this.messageEntity.saveOne(
        {
          userId: currentUserId,
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
          lastMessageBy: currentUserId,
          lastMessageRead: false,
        },
        currentUserId,
      ),
    ]);
    socket.emit('updateMsg', message);
    const userIds = this.relationshipEntity.getUserIdsFromId(relationshipId);
    const targetUserId = this.userEntity.isUserOneByIds(currentUserId, userIds)
      ? userIds[1]
      : userIds[0];
    socket.to([currentUserId, targetUserId]).emit('msg', message);
  }
}
