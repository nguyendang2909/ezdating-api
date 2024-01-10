import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ApiWriteService } from '../../../commons';
import { MatchesHandler } from '../../../handlers/matches.handler';
import { MatchModel, User, UserModel } from '../../../models';
import { MongoConnection } from '../../../models/mongo.connection';
import { MatchesUtil, UsersUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { BlockUserDto } from '../dto/block-user.dto';

@Injectable()
export class UsersWriteService extends ApiWriteService<User> {
  constructor(
    private readonly userModel: UserModel,
    private readonly usersUtil: UsersUtil,
    private readonly mongoConnection: MongoConnection,
    private readonly matchesHandler: MatchesHandler,
    private readonly matchModel: MatchModel,
    private readonly matchUtl: MatchesUtil,
  ) {
    super();
  }

  public async block(payload: BlockUserDto, client: ClientData): Promise<void> {
    const { _currentUserId, currentUserId } = this.getClient(client);
    const _targetUserId = this.getObjectId(payload.targetUserId);
    const [currentUser] = await Promise.all([
      this.userModel.findOneOrFailById(_currentUserId, {
        _id: true,
        _blockedIds: true,
      }),
      this.userModel.findOneOrFailById(_targetUserId, { _id: true }),
    ]);
    this.usersUtil.verifyCanBlock(currentUser);
    await this.mongoConnection
      .withTransaction(async () => {
        await Promise.all([
          this.userModel.updateOneById(_currentUserId, {
            $addToSet: { _blockedIds: _targetUserId },
          }),
          this.userModel.updateOneById(_currentUserId, {
            $addToSet: { _blockedByIds: _currentUserId },
          }),
        ]);
      })
      .catch((err) => {
        this.logger.error(
          `Error when block user ${currentUserId} block ${payload.targetUserId}`,
          err.stack,
        );
        throw new InternalServerErrorException();
      });
    await this.matchesHandler.unmatchIfExist({
      currentUserId,
      targetUserId: payload.targetUserId,
    });
  }

  public async unblock(
    payload: BlockUserDto,
    client: ClientData,
  ): Promise<void> {
    const { _currentUserId, currentUserId } = this.getClient(client);
    const _targetUserId = this.getObjectId(payload.targetUserId);
    const [currentUser, targetUser] = await Promise.all([
      this.userModel.findOneOrFailById(_currentUserId, {
        _id: true,
        _blockedIds: true,
      }),
      this.userModel.findOneOrFailById(_targetUserId, {
        _id: true,
        _blockedByIds: true,
      }),
    ]);
    this.usersUtil.verifyCanUnblock(currentUser, targetUser);
    await this.mongoConnection
      .withTransaction(async () => {
        await Promise.all([
          this.userModel.updateOneById(_currentUserId, {
            $pull: { _blockedIds: _targetUserId },
          }),
          this.userModel.updateOneById(_currentUserId, {
            $pull: { _blockedByIds: _currentUserId },
          }),
        ]);
      })
      .catch((err) => {
        this.logger.error(
          `Error when block user ${currentUserId} block ${payload.targetUserId}`,
          err.stack,
        );
        throw new InternalServerErrorException();
      });
  }
}
