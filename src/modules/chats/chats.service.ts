import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { MessageModel } from '../entities/message.model';
import { RelationshipModel } from '../entities/relationship-entity.model';
import { UserModel } from '../entities/users.model';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly relationshipModel: RelationshipModel,
    private readonly messageModel: MessageModel,
    private readonly userModel: UserModel,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { relationshipId, text, uuid } = payload;
    const currentUser = socket.handshake.user;
    const currentUserId = socket.handshake.user.id;
    const existRelationship = this.relationshipModel.findOneConversationById(
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
      this.messageModel.saveOne(
        {
          user: { id: currentUserId },
          relationship: { id: relationshipId },
          text,
          uuid,
          createdAt: messageCreatedAt,
        },
        currentUserId,
      ),
      this.relationshipModel.updateOneById(
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
    const formattedMessage = {
      ...message,
      user: {
        id: currentUserId,
        nickname: currentUser.nickname,
        avatar: currentUser.avatar,
      },
    };
    const userIds = this.relationshipModel.getUserIdsFromId(relationshipId);
    const targetUserId = this.userModel.isUserOneByIds(currentUserId, userIds)
      ? userIds[1]
      : userIds[0];
    socket.to([currentUserId, targetUserId]).emit('msg', formattedMessage);
  }
}
