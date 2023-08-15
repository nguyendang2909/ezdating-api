import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import {
  Constants,
  RelationshipUserStatuses,
} from '../../commons/constants/constants';
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

    const existRelationship = await this.relationshipModel.model
      .findOne({
        _id: _relationshipId,
        userOneStatus: RelationshipUserStatuses.like,
        userTwoStatus: RelationshipUserStatuses.like,
      })
      .lean()
      .exec();

    if (!existRelationship) {
      socket.emit(Constants.socketEvents.toClient.error, {
        errorCode: HttpErrorCodes.RELATIONSHIP_DOES_NOT_EXIST,
        message: 'Relationship not found',
      });

      return;
    }

    const { _userOneId, _userTwoId } = existRelationship;

    if (!_userOneId || !_userTwoId) {
      socket.emit(Constants.socketEvents.toClient.error, {
        errorCode: HttpErrorCodes.RELATIONSHIP_IS_INVALID,
        message: 'Relationship is invalid',
      });

      return;
    }
    const { userOneId, userTwoId } = this.relationshipModel.getUsersFromIds({
      _userOneId,
      _userTwoId,
      currentUserId,
    });

    const isUserOne = currentUserId === userOneId;

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
          ...(isUserOne
            ? { userTwoRead: false, userOneRead: true }
            : { userOneRead: false, userTwoRead: true }),
        },
      ),
    ]);

    socket.emit(Constants.socketEvents.toClient.updateMessage, message);

    socket
      .to([userOneId, userTwoId])
      .emit(Constants.socketEvents.toClient.newMessage, message);
  }
}
