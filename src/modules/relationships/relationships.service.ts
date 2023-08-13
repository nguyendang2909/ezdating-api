import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';

import { RelationshipUserStatuses } from '../../commons/constants/constants';
import { ResponseSuccess } from '../../commons/dto/response.dto';
import { ClientData } from '../auth/auth.type';
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
      return { success: false };
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
      // TODO: Socket emit event matches
    }

    return { success: true };
  }

  public async findMatched(
    queryParams: FindMatchedRelationshipsDto,
    currentUserId: string,
  ) {
    const { after, before } = queryParams;

    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const cursor = this.relationshipModel.extractCursor(after || before);

    const cursorValue = cursor ? new Date(cursor) : undefined;

    const findResult = await this.relationshipModel.model
      .aggregate()
      .match({
        userOneStatus: RelationshipUserStatuses.like,
        userTwoStatus: RelationshipUserStatuses.like,
        ...(cursorValue
          ? {
              statusAt: {
                [after ? '$gt' : '$lt']: cursorValue,
              },
            }
          : {}),
      })
      .lookup({
        from: 'users',
        let: { userOneId: '$_userOneId', userTwoId: '$_userTwoId' },
        pipeline: [
          {
            $match: {
              _id: {
                $ne: _currentUserId,
              },
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$userOneId'] },
                  { $eq: ['$_id', '$$userTwoId'] },
                ],
              },
            },
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
              ],
              as: 'mediaFiles',
            },
          },
          {
            $limit: 1,
          },
        ],
        as: 'targetUser',
      })
      .addFields({
        targetUser: { $first: '$targetUser' },
      })
      .sort({
        statusAt: -1,
      })
      .limit(20);

    return {
      data: findResult,
      pagination: {
        cursor: this.relationshipModel.getCursors({
          // after: _.first(findResult)?.statusAt,
          before: _.last(findResult)?.statusAt,
        }),
      },
    };
  }

  public async findUsersLikeMe(
    queryParams: FindMatchedRelationshipsDto,
    currentUserId: string,
  ) {
    // const { after, before } = queryParams;
    // const extractCursor = EntityFactory.extractCursor(after || before);
    // const lastStatusAt = extractCursor
    //   ? new Date(extractCursor.value)
    //   : undefined;
    // const findResult = await this.relationshipModel.findMany({
    //   where: [
    //     {
    //       ...(lastStatusAt
    //         ? {
    //             userTwoStatus:
    //               extractCursor?.type === Cursors.after
    //                 ? LessThan(lastStatusAt)
    //                 : MoreThan(lastStatusAt),
    //           }
    //         : {}),
    //       userOneStatus: Not(RelationshipUserStatuses.like),
    //       userTwoStatus: RelationshipUserStatuses.like,
    //       userOne: {
    //         id: currentUserId,
    //       },
    //     },
    //     {
    //       ...(lastStatusAt
    //         ? {
    //             userOneStatusAt:
    //               extractCursor?.type === Cursors.after
    //                 ? LessThan(lastStatusAt)
    //                 : MoreThan(lastStatusAt),
    //           }
    //         : {}),
    //       userOneStatus: RelationshipUserStatuses.like,
    //       userTwoStatus: Not(RelationshipUserStatuses.like),
    //       userTwo: {
    //         id: currentUserId,
    //       },
    //     },
    //   ],
    //   order: {
    //     statusAt: 'DESC',
    //   },
    //   take: 20,
    // });

    return {
      data: [],
      pagination: {
        cursor: this.relationshipModel.getCursors({
          before: null,
          after: null,
        }),
      },
    };
  }
}
