import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const findResult = await this.relationshipModel.model.aggregate([
      {
        $match: {
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
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
                  [after ? '$lte' : '$gte']: cursorValue,
                },
              }
            : { lastMessageAt: { $ne: null } }),
        },
      },
      {
        $sort: { lastMessageAt: -1 },
      },
      { $limit: 20 },
      {
        $set: {
          isUserOne: {
            $cond: {
              if: {
                $eq: ['$_userOneId', _currentUserId],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            targetUserId: {
              $cond: {
                if: {
                  $eq: ['$isUserOne', true],
                },
                then: '$_userTwoId',
                else: '$_userOneId',
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$targetUserId'],
                },
              },
            },
            {
              $limit: 1,
            },
            {
              $lookup: {
                from: 'mediafiles',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_userId', '$$userId'],
                      },
                    },
                  },
                  { $limit: 6 },
                  {
                    $project: {
                      _id: true,
                      location: true,
                    },
                  },
                ],
                as: 'mediaFiles',
              },
            },
            {
              $set: {
                age: {
                  $dateDiff: {
                    startDate: '$birthday',
                    endDate: '$$NOW',
                    unit: 'year',
                  },
                },
              },
            },
            {
              $project: {
                _id: true,
                nickname: true,
                status: true,
                lastActivatedAt: true,
                age: 1,
                filterGender: true,
                filterMaxAge: true,
                filterMaxDistance: true,
                filterMinAge: true,
                gender: true,
                introduce: true,
                lookingFor: true,
                mediaFiles: true,
              },
            },
          ],
          as: 'targetUser',
        },
      },
      {
        $set: {
          targetUser: { $first: '$targetUser' },
          read: {
            $cond: {
              if: {
                $eq: ['$isUserOne', true],
              },
              then: '$userOneRead',
              else: '$userTwoRead',
            },
          },
        },
      },
    ]);

    return {
      type: 'conversations',
      data: findResult,
      pagination: {
        cursors: this.relationshipModel.getCursors({
          after: _.last(findResult)?.lastMessageAt,
          before: _.first(findResult)?.lastMessageAt,
        }),
      },
    };
  }

  public async findOneOrFailById(id: string, clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _id = this.relationshipModel.getObjectId(id);
    const _currentUserId = this.relationshipModel.getObjectId(currentUserId);

    const findResult = await this.relationshipModel.model.aggregate([
      {
        $match: {
          _id,
          $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'users',
          let: {
            targetUserId: {
              $cond: {
                if: {
                  $eq: ['$_userOneId', _currentUserId],
                },
                then: '$_userTwoId',
                else: '$_userOneId',
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$targetUserId'],
                },
              },
            },
            {
              $limit: 1,
            },
            {
              $lookup: {
                from: 'mediafiles',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_userId', '$$userId'],
                      },
                    },
                  },
                  { $limit: 6 },
                  {
                    $project: {
                      _id: true,
                      location: true,
                    },
                  },
                ],
                as: 'mediaFiles',
              },
            },
            {
              $set: {
                age: {
                  $dateDiff: {
                    startDate: '$birthday',
                    endDate: '$$NOW',
                    unit: 'year',
                  },
                },
              },
            },
            {
              $project: {
                _id: true,
                nickname: true,
                status: true,
                lastActivatedAt: true,
                age: 1,
                filterGender: true,
                filterMaxAge: true,
                filterMaxDistance: true,
                filterMinAge: true,
                gender: true,
                introduce: true,
                lookingFor: true,
                mediaFiles: true,
              },
            },
          ],
          as: 'targetUser',
        },
      },
    ]);

    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.CONVERSATION_DOES_NOT_EXIST,
        message: 'Conversation does not exist!',
      });
    }

    return {
      type: 'conversations',
      data: findResult,
    };
  }

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
    const { _userOneId, _userTwoId } = conversation;
    if (!_userOneId || !_userTwoId) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.RELATIONSHIP_IS_INVALID,
        message: 'Relationship is invalid!',
      });
    }
    const { isUserOne } = this.relationshipModel.getUsersFromIds({
      _userOneId,
      _userTwoId,
      currentUserId,
    });
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
                  [after ? '$lt' : '$gt']: cursorValue,
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
          after: _.last(findResult)?.createdAt?.toString(),
          before: _.first(findResult)?.createdAt?.toString(),
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
