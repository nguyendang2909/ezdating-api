import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ApiWriteMeService } from '../../../commons';
import { USER_STATUSES } from '../../../constants';
import { MatchesHandler } from '../../../handlers/matches.handler';
import { FilesService } from '../../../libs';
import {
  BasicProfileModel,
  CoinAttendanceModel,
  MatchModel,
  MediaFileModel,
  MessageModel,
  ProfileFilterModel,
  ProfileModel,
  SignedDeviceModel,
  User,
  UserModel,
  ViewModel,
  ViolationReportModel,
} from '../../../models';
import { MongoConnection } from '../../../models/mongo.connection';
import { MatchesUtil, UsersUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { BlockUserDto } from '../dto/block-user.dto';

@Injectable()
export class UsersWriteMeService extends ApiWriteMeService<User> {
  constructor(
    private readonly userModel: UserModel,
    private readonly usersUtil: UsersUtil,
    private readonly mongoConnection: MongoConnection,
    private readonly matchesHandler: MatchesHandler,
    private readonly matchModel: MatchModel,
    private readonly matchUtl: MatchesUtil,
    private readonly profileModel: ProfileModel,
    private readonly profileFilterModel: ProfileFilterModel,
    private readonly messageModel: MessageModel,
    private readonly coinAttendanceModel: CoinAttendanceModel,
    private readonly mediaFileModel: MediaFileModel,
    private readonly basicProfileModel: BasicProfileModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly viewModel: ViewModel,
    private readonly violationReportModel: ViolationReportModel,
    private readonly filesService: FilesService,
  ) {
    super();
  }

  public async block(payload: BlockUserDto, client: ClientData): Promise<void> {
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
    this.usersUtil.verifyCanBlock(currentUser);
    await this.mongoConnection
      .withTransaction(async () => {
        await Promise.all([
          this.userModel.updateOneById(_currentUserId, {
            $addToSet: { _blockedIds: _targetUserId },
          }),
          this.userModel.updateOneById(_currentUserId, {
            $addToSet: { _blockedByIds: _currentUserId },
            $set: {
              ...(targetUser._blockedByIds &&
              targetUser._blockedByIds?.length > 99
                ? {
                    status: USER_STATUSES.BANNED,
                    bannedReason:
                      'You receive too many blocks from other members',
                  }
                : {}),
            },
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

  async delete(client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    await this.userModel.deleteOne({ _id: _currentUserId });
    const [matches, mediaFiles] = await Promise.all([
      this.matchModel.findManyByUserId(_currentUserId, {
        _id: true,
      }),
      this.mediaFileModel.findMany({
        _userId: _currentUserId,
      }),
    ]);
    await Promise.all([
      this.basicProfileModel.deleteOneById(_currentUserId),
      this.profileModel.deleteOneById(_currentUserId),
      this.profileFilterModel.deleteOneById(_currentUserId),
      this.coinAttendanceModel.deleteManyByUserId(_currentUserId),
      this.signedDeviceModel.deleteManyByUserId(_currentUserId),
      this.viewModel.deleteManyByUserId(_currentUserId),
      this.violationReportModel.deleteMany({
        $or: [{ _userId: _currentUserId }, { _targetUserId: _currentUserId }],
      }),
      this.matchModel.deleteManyByUserId(_currentUserId),
      this.messageModel.deleteManyByMatches(matches),
      this.mediaFileModel.deleteManyByUserId(_currentUserId),
      this.filesService.removeManyByMediaFiles(mediaFiles),
    ]);
  }
}
