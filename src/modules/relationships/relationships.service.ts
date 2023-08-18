import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';

import {
  Constants,
  RelationshipUserStatuses,
} from '../../commons/constants/constants';
import { ResponseSuccess } from '../../commons/dto/response.dto';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { MessageModel } from '../models/message.model';
import { RelationshipModel } from '../models/relationship.model';
import { UserModel } from '../models/user.model';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly relationshipModel: RelationshipModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
    private readonly chatsGateway: ChatsGateway,
  ) {}

  public async sendLikeStatus(
    targetUserId: string,
    clientData: ClientData,
  ): Promise<ResponseSuccess> {
    const currentUserId = clientData.id;

    this.relationshipModel.validateYourSelf(currentUserId, targetUserId);

    const { isUserOne, _userOneId, _userTwoId } =
      this.relationshipModel.getSortedUserIds({
        currentUserId,
        targetUserId,
      });

    const existRelationship = await this.relationshipModel.findOne({
      _userOneId,
      _userTwoId,
    });

    if (
      existRelationship &&
      this.relationshipModel.haveSentStatus(
        RelationshipUserStatuses.like,
        existRelationship,
        isUserOne,
      )
    ) {
      throw new ConflictException({
        errorCode: HttpErrorCodes.CONFLICT_RELATIONSHIP_STATUS,
        message: 'You already sent like status',
      });
    }

    const now = moment().toDate();

    const relationship = await this.relationshipModel.findAndUpsertOneByUserIds(
      {
        _userOneId,
        _userTwoId,
      },
      {
        _userOneId,
        _userTwoId,
        statusAt: now,
        ...(isUserOne
          ? {
              userOneStatus: RelationshipUserStatuses.like,
              userOneStatusAt: now,
            }
          : {
              userTwoStatus: RelationshipUserStatuses.like,
              userTwoStatusAt: now,
            }),
      },
      {
        upsert: true,
        new: true,
      },
    );

    if (isUserOne) {
      if (relationship.userTwoStatus === RelationshipUserStatuses.like) {
        // TODO: Notify by socket
      }
    } else {
      if (relationship.userOneStatus === RelationshipUserStatuses.like) {
      }
    }

    const haveBeenLiked = this.relationshipModel.haveBeenLiked(
      relationship,
      isUserOne,
    );
    if (haveBeenLiked) {
      this.chatsGateway.server.to(currentUserId).emit('matched', relationship);
      this.chatsGateway.server.to(targetUserId).emit('matched', relationship);
      // TODO: Socket emit event matches
    }

    return { success: true };
  }

  public async cancelMatched(
    id: string,
    clientData: ClientData,
  ): Promise<ResponseSuccess> {
    const _id = this.relationshipModel.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const { _userOneId, _userTwoId } =
      await this.relationshipModel.findOneOrFail({
        _id,
        $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
        userOneStatus: RelationshipUserStatuses.like,
        userTwoRead: RelationshipUserStatuses.like,
      });

    if (!_userOneId || !_userTwoId) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.RELATIONSHIP_IS_INVALID,
        message: 'Relationship is invalid',
      });
    }

    const updateResult = await this.relationshipModel.model.updateOne(
      { _id },
      {
        $unset: {
          _lastMessageUserId: 1,
          lastMessage: 1,
          lastMessageAt: 1,
        },
        ...(this.relationshipModel.areObjectIdEqual(_currentUserId, _userOneId)
          ? {
              userOneStatus: RelationshipUserStatuses.cancel,
            }
          : {
              userTwoStatus: RelationshipUserStatuses.cancel,
            }),
      },
    );
    const success = !!updateResult.modifiedCount;

    if (success) {
      this.chatsGateway.server
        .to([_userOneId.toString(), _userTwoId.toString()])
        .emit(Constants.socketEvents.toClient.cancelMatched, { _id });
    }

    return { success: !!updateResult.modifiedCount };
  }

  public async findMatched(
    queryParams: FindMatchedRelationshipsDto,
    currentUserId: string,
  ) {
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const { after, before } = queryParams;
    const cursor = this.relationshipModel.extractCursor(after || before);
    const cursorValue = cursor ? new Date(cursor) : undefined;

    const findResult = await this.relationshipModel.model
      .aggregate([
        {
          $match: {
            userOneStatus: RelationshipUserStatuses.like,
            userTwoStatus: RelationshipUserStatuses.like,
            lastMessageAt: null,
            ...(cursorValue
              ? {
                  statusAt: {
                    [after ? '$lt' : '$gt']: cursorValue,
                  },
                }
              : {}),
          },
        },
        {
          $sort: {
            statusAt: -1,
          },
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
            read: false,
          },
        },
      ])
      .exec();

    return {
      data: findResult,
      pagination: {
        cursor: this.relationshipModel.getCursors({
          after: _.last(findResult)?.statusAt,
          before: _.first(findResult)?.statusAt,
        }),
      },
    };
  }

  public async findManyLikedMe(
    queryParams: FindMatchedRelationshipsDto,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const { after, before } = queryParams;
    const cursor = this.relationshipModel.extractCursor(after || before);
    const cursorValue = cursor ? new Date(cursor) : undefined;

    const findResult = this.relationshipModel.model
      .aggregate([
        {
          $match: {
            ...(cursorValue
              ? {
                  statusAt: {
                    [after ? '$gt' : '$lt']: cursorValue,
                  },
                }
              : {}),
            $or: [
              {
                _userOneId: _currentUserId,
                userOneStatus: { $ne: RelationshipUserStatuses.like },
                userTwoStatus: RelationshipUserStatuses.like,
              },
              {
                _userTwoId: _currentUserId,
                userOneStatus: RelationshipUserStatuses.like,
                userTwoStatus: { $ne: RelationshipUserStatuses.like },
              },
            ],
          },
        },
        {
          $sort: {
            statusAt: -1,
          },
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
      ])
      .exec();

    return {
      data: findResult,
      pagination: {
        cursor: this.relationshipModel.getCursors({
          before: null,
          after: null,
        }),
      },
    };
  }
}
