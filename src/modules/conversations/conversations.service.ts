import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Types } from 'mongoose';

import { RelationshipUserStatuses } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { FindManyMessagesByConversationIdDto } from '../messages/dto/find-many-messages.dto';
import { MessageModel } from '../models/message.model';
import { RelationshipModel } from '../models/relationship.model';
import { UserModel } from '../models/user.model';
import { FindManyConversations } from './dto/find-many-conversations.dto';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly relationshipModel: RelationshipModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
  ) {}

  public async findMany(
    queryParams: FindManyConversations,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const { after, before } = queryParams;
    const cursor = this.relationshipModel.extractCursor(after || before);
    const cursorValue = cursor ? new Date(cursor) : undefined;

    const findResult = await this.relationshipModel.model
      .aggregate()
      .match({
        userOneStatus: RelationshipUserStatuses.like,
        userTwoStatus: RelationshipUserStatuses.like,
        _lastMessageUserId: { $ne: null },
        $or: [
          {
            _userOneId: _currentUserId,
          },
          {
            _userTwoId: _currentUserId,
          },
        ],
        ...(cursorValue
          ? {
              lastMessageAt: {
                [after ? '$gte' : '$lte']: cursorValue,
              },
            }
          : {}),
      })
      .sort({
        lastMessageAt: -1,
      })
      .limit(25)
      .exec();

    return {
      type: 'conversations',
      data: findResult,
      pagination: {
        cursors: this.relationshipModel.getCursors({
          // after: _.first(findResult)?.lastMessageAt,
          before: _.last(findResult)?.lastMessageAt,
        }),
      },
    };
  }

  // public async findOneOrFailById(id: string, clientData: ClientData) {
  //   const currentUserObj = {
  //     id: clientData.id,
  //   };
  //   const lastMessageQuery = { lastMessage: Not(IsNull()) };
  //   const findResult = await this.relationshipModel.findOne({
  //     where: [
  //       {
  //         ...lastMessageQuery,
  //         userOneStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userTwoStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userOne: currentUserObj,
  //       },
  //       {
  //         ...lastMessageQuery,
  //         userOneStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userTwoStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userTwo: currentUserObj,
  //       },
  //     ],
  //     order: {
  //       lastMessageAt: 'DESC',
  //     },
  //     relations: [
  //       'userOne',
  //       'userOne.avatarFile',
  //       'userTwo',
  //       'userTwo.avatarFile',
  //     ],
  //     select: {
  //       userOne: {
  //         id: true,
  //         birthday: true,
  //         gender: true,
  //         introduce: true,
  //         lastActivatedAt: true,
  //         lookingFor: true,
  //         nickname: true,
  //         role: true,
  //         status: true,
  //         avatarFile: {
  //           location: true,
  //         },
  //       },
  //       userTwo: {
  //         id: true,
  //         birthday: true,
  //         gender: true,
  //         introduce: true,
  //         lastActivatedAt: true,
  //         lookingFor: true,
  //         nickname: true,
  //         role: true,
  //         status: true,
  //         avatarFile: {
  //           location: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!findResult) {
  //     throw new NotFoundException({
  //       errorCode: HttpErrorCodes.CONVERSATION_DOES_NOT_EXIST,
  //       message: 'Conversation does not exist!',
  //     });
  //   }

  //   const conversation = this.relationshipModel.formatConversation(
  //     findResult,
  //     clientData.id,
  //   );

  //   return {
  //     type: 'conversations',
  //     data: conversation,
  //   };
  // }

  public async findManyMessagesByConversationId(
    conversationId: string,
    queryParams: FindManyMessagesByConversationIdDto,
    clientData: ClientData,
  ) {
    const _conversationId = this.relationshipModel.getObjectId(conversationId);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const conversation = await this.verifyConversationOfUser(
      _conversationId,
      _currentUserId,
    );

    const isUserOne = conversation._userOneId.toString() === currentUserId;

    const { before, after } = queryParams;
    const cursor = this.relationshipModel.extractCursor(after || before);
    const cursorValue = cursor ? new Date(cursor) : undefined;

    const findResult = await this.messageModel.model
      .find(
        {
          _relationshipId: _conversationId,
          ...(cursorValue
            ? {
                createdAt: {
                  [after ? '$gt' : '$lt']: cursorValue,
                },
              }
            : {}),
        },
        {},
      )
      .sort({ createdAt: -1 })
      .limit(25)
      .lean()
      .exec();

    await this.relationshipModel.model.updateOne(
      { _id: conversation._id },
      {
        ...(isUserOne ? { userOneRead: true } : { userTwoRead: true }),
      },
    );

    return {
      type: 'messagesByConversation',
      conversationId,
      data: findResult,
      pagination: {
        cursors: this.messageModel.getCursors({
          // after: _.first(findResult)?.createdAt?.toString(),
          before: _.last(findResult)?.createdAt?.toString(),
        }),
      },
    };
  }

  // public async findManyByQuery(
  //   queryParams: FindManyConversations,
  //   clientData: ClientData,
  // ) {
  //   const { cursor } = queryParams;

  //   const extractCursor = EntityFactory.extractCursor(cursor);

  //   const lastMessageAt = extractCursor
  //     ? new Date(extractCursor.value)
  //     : undefined;
  //   const lastMessageAtQuery = lastMessageAt
  //     ? {
  //         lastMessageAt:
  //           extractCursor?.type === Cursors.before
  //             ? MoreThan(lastMessageAt)
  //             : LessThan(lastMessageAt),
  //       }
  //     : { lastMessageAt: Not(IsNull()) };
  //   return await this.relationshipModel.findMany({
  //     where: [
  //       {
  //         ...lastMessageAtQuery,
  //         userOneStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userTwoStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userOne: {
  //           id: clientData.id,
  //         },
  //       },
  //       {
  //         ...lastMessageAtQuery,
  //         userOneStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userTwoStatus: And(
  //           Not(RelationshipUserStatuses.block),
  //           Not(RelationshipUserStatuses.cancel),
  //         ),
  //         userTwo: {
  //           id: clientData.id,
  //         },
  //       },
  //     ],
  //     order: {
  //       lastMessageAt: 'DESC',
  //     },
  //     relations: [
  //       'userOne',
  //       'userOne.uploadFiles',
  //       'userOne.avatarFile',
  //       'userTwo',
  //       'userTwo.uploadFiles',
  //       'userTwo.avatarFile',
  //     ],
  //     select: {
  //       userOne: {
  //         id: true,
  //         birthday: true,
  //         gender: true,
  //         introduce: true,
  //         lastActivatedAt: true,
  //         lookingFor: true,
  //         nickname: true,
  //         role: true,
  //         status: true,
  //         avatarFile: {
  //           location: true,
  //         },
  //         uploadFiles: {
  //           location: true,
  //         },
  //       },
  //       userTwo: {
  //         id: true,
  //         birthday: true,
  //         gender: true,
  //         introduce: true,
  //         lastActivatedAt: true,
  //         lookingFor: true,
  //         nickname: true,
  //         role: true,
  //         status: true,
  //         avatarFile: {
  //           location: true,
  //         },
  //         uploadFiles: {
  //           location: true,
  //         },
  //       },
  //     },
  //   });
  // }

  private async verifyConversationOfUser(
    _conversationId: Types.ObjectId,
    _currentUserId: Types.ObjectId,
  ) {
    const existConversation = await this.relationshipModel.findOne({
      _id: _conversationId,
      $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
    });
    if (!existConversation) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONVERSATION_DOES_NOT_EXIST,
        message: 'Conversation does not exist!',
      });
    }
    return existConversation;
  }
}
