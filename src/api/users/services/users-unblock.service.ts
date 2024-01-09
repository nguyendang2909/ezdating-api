import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ApiUpdateBaseService } from '../../../commons/services/api/api-update.base.service';
import { ClientData } from '../../auth/auth.type';
import { User, UserModel } from '../../../models';
import { MongoConnection } from '../../../models/mongo.connection';
import { BlockUserDto } from '../dto/block-user.dto';

@Injectable()
export class UsersUnblockService extends ApiUpdateBaseService {
  constructor(
    private readonly userModel: UserModel,
    private readonly mongoConnection: MongoConnection,
  ) {
    super();
  }

  public async run(payload: BlockUserDto, client: ClientData): Promise<void> {
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
    this.verifyCanUnblock(currentUser, targetUser);
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

  private verifyCanUnblock(currentUser: User, targetUser: User) {
    if (
      !currentUser._blockedIds
        ?.map((e) => e.toString())
        .includes(targetUser._id.toString()) &&
      !targetUser._blockedByIds
        ?.map((e) => e.toString())
        .includes(targetUser._id.toString())
    ) {
      throw new BadRequestException();
    }
  }
}
