import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { RelationshipUserStatuses } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { MessageModel } from '../models/message.model';
import { RelationshipModel } from '../models/relationship.model';
import { UserModel } from '../models/user.model';
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

    const currentUserId = socket.handshake.user.id;

    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const _relationshipId = this.relationshipModel.getObjectId(relationshipId);

    const existRelationship = await this.relationshipModel.findOne({
      _id: _relationshipId,
      userOneStatus: RelationshipUserStatuses.like,
      userTwoStatus: RelationshipUserStatuses.like,
    });

    if (!existRelationship) {
      socket.emit('error', {
        errorCode: HttpErrorCodes.RELATIONSHIP_DOES_NOT_EXIST,
        message: 'Relationship does not exist!',
      });
      return;
    }

    const messageCreatedAt = moment().toDate();

    // TODO: transaction
    const [message] = await Promise.all([
      this.messageModel.createOne({
        _userId: _currentUserId,
        _relationshipId: existRelationship._id,
        text,
        uuid,
        createdAt: messageCreatedAt,
      }),
      this.relationshipModel.model.updateOne(
        { _id: existRelationship._id },
        {
          lastMessageAt: messageCreatedAt,
          lastMessage: text,
          _lastMessageUserId: currentUserId,
          lastMessageRead: false,
        },
      ),
    ]);

    socket.emit('updateMsg', message);

    const currentUser = await this.userModel.findOne({
      _id: _currentUserId,
    });

    if (!currentUser) {
      return;
    }
    // const formattedMessage = {
    //   ...message,
    //   user: {
    //     id: currentUserId,
    //     nickname: currentUser.nickname,
    //     avatar: currentUser.avatar,
    //   },
    // };
    // const sortedUserIds =
    //   this.relationshipModel.getUserIdsFromId(relationshipId);
    // const targetUserId = this.relationshipModel.isUserOneBySortedIds(
    //   currentUserId,
    //   sortedUserIds,
    // )
    //   ? sortedUserIds[1]
    //   : sortedUserIds[0];
    // socket.to([currentUserId, targetUserId]).emit('msg', formattedMessage);
  }
}
