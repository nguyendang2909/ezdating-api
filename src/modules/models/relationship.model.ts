import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Types } from 'mongoose';

import { RelationshipUserStatus } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { CommonModel } from './common-model';
import {
  Relationship,
  RelationshipDocument,
} from './schemas/relationship.schema';

@Injectable()
export class RelationshipModel extends CommonModel {
  constructor(
    @InjectModel(Relationship.name)
    public readonly model: Model<Relationship>,
  ) {
    super();
  }

  public async createOne(entity: Partial<Relationship>) {
    const mediaFile = await this.model.create(entity);

    return mediaFile.toJSON();
  }

  public async findMany(
    filter: FilterQuery<RelationshipDocument>,
    projection?: ProjectionType<RelationshipDocument> | null | undefined,
    options?: QueryOptions<RelationshipDocument> | null | undefined,
  ) {
    return await this.model
      .find(filter, projection, {
        limit: 20,
        ...options,
      })
      .exec();
  }

  public async findOne(
    filter: FilterQuery<RelationshipDocument>,
    projection?: ProjectionType<RelationshipDocument> | null,
    options?: QueryOptions<RelationshipDocument> | null,
  ) {
    if (_.isEmpty(filter)) {
      return null;
    }
    return await this.model.findOne(filter, projection, options).exec();
  }

  public async findOneOrFail(
    filter: FilterQuery<RelationshipDocument>,
    projection?: ProjectionType<RelationshipDocument> | null,
    options?: QueryOptions<RelationshipDocument> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.RELATIONSHIP_DOES_NOT_EXIST,
        message: 'Relationship does not exist!',
      });
    }
    return findResult;
  }

  //   public async findOneConversationById(id: string, userId: string) {
  //     return await this.repository.findOne({
  //       where: [
  //         {
  //           id,
  //           userOneStatus: RelationshipUserStatuses.like,
  //           userTwoStatus: RelationshipUserStatuses.like,
  //         },
  //         {
  //           id,
  //           userOne: {
  //             id: userId,
  //           },
  //           userTwoStatus: Not(RelationshipUserStatuses.block),
  //         },
  //         {
  //           id,
  //           userTwo: {
  //             id: userId,
  //           },
  //           userOneStatus: Not(RelationshipUserStatuses.block),
  //           canUserTwoChat: true,
  //         },
  //       ],
  //     });
  //   }

  // public async findAndUpsertOneByUserIds(
  //   userIds: { _userOneId: Types.ObjectId; _userTwoId: Types.ObjectId },
  //   updateQuery: UpdateQuery<Relationship>,
  //   options?: QueryOptions<Relationship> | null,
  // ) {
  //   return await this.model
  //     .findOneAndUpdate(userIds, updateQuery, {
  //       ...options,
  //       new: true,
  //       upsert: true,
  //     })
  //     .lean()
  //     .exec();
  // }

  public async deleteOneById(_id: Types.ObjectId) {
    const deleteResult = await this.model.deleteOne({ _id });

    return !!deleteResult.deletedCount;
  }

  public getSortedUserIds({
    currentUserId,
    targetUserId,
  }: {
    currentUserId: string;
    targetUserId: string;
  }): {
    sortedUserIds: string[];
    isUserOne: boolean;
    userOneId: string;
    userTwoId: string;
    _userOneId: Types.ObjectId;
    _userTwoId: Types.ObjectId;
  } {
    const sortedUserIds = [currentUserId, targetUserId].sort();
    const userOneId = sortedUserIds[0];
    const userTwoId = sortedUserIds[1];

    return {
      sortedUserIds,
      isUserOne: sortedUserIds[0] === currentUserId,
      userOneId,
      userTwoId,
      _userOneId: this.getObjectId(userOneId),
      _userTwoId: this.getObjectId(userTwoId),
    };
  }

  public getUsersFromIds({
    _userOneId,
    _userTwoId,
    currentUserId,
  }: {
    _userOneId: Types.ObjectId;
    _userTwoId: Types.ObjectId;
    currentUserId: string;
  }) {
    const userOneId = _userOneId.toString();
    const userTwoId = _userTwoId.toString();

    return {
      userOneId,
      userTwoId,
      isUserOne: userOneId === currentUserId,
    };
  }

  //   validateConflictSendStatus(
  //     status: RelationshipUserStatus,
  //     entity: Relationship,
  //     isUserOne: boolean,
  //   ) {
  //     if (status === (isUserOne ? entity.userOneStatus : entity.userTwoStatus)) {
  //       throw new BadRequestException({
  //         errorCode: HttpErrorCodes.CONFLICT_RELATIONSHIP_STATUS,
  //         message: 'You already sent this status!',
  //       });
  //     }
  //   }

  //   sortUserIds(userIdOne: string, userIdTwo: string): string[] {
  //     // const sortedUserIds =
  //     return [userIdOne, userIdTwo].sort();
  //   }

  //   getIdFromSortedUserIds(userIds: string[]) {
  //     return userIds.join('_');
  //   }

  //   getIdFromUnsortedUserIds(userIds: string[]) {
  //     return userIds.sort().join('_');
  //   }

  //   getUserIdsFromId(id: string): string[] {
  //     return id.split('_');
  //   }

  //   public isUserOneBySortedIds(userId: string, userIds: string[]): boolean {
  //     return userId === userIds[0];
  //   }

  //   public isUserOneByEntities(userId: string, entities: User[]): boolean {
  //     return userId === entities[0]?.id;
  //   }

  public validateYourSelf(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONFLICT_USER,
        message: 'You cannot send status yourself!',
      });
    }
  }

  //   formatConversations(entities: Relationship[], currentUserId: string) {
  //     return entities.map((item) => {
  //       return this.formatConversation(item, currentUserId);
  //     });
  //   }

  haveSentStatus(
    status: RelationshipUserStatus,
    document: RelationshipDocument,
    isUserOne: boolean,
  ): boolean {
    if (isUserOne) {
      if (document.userOneStatus === status) {
        return true;
      }
    } else {
      if (document.userTwoStatus === status) {
        return true;
      }
    }

    return false;
  }

  // haveBeenLiked(
  //   document:
  //     | RelationshipDocument
  //     | (FlattenMaps<Relationship> & { _id: Types.ObjectId }),
  //   isUserOne: boolean,
  // ): boolean {
  //   return isUserOne
  //     ? document.userTwoStatus === RelationshipUserStatuses.like
  //     : document.userOneStatus === RelationshipUserStatuses.like;
  // }
}
