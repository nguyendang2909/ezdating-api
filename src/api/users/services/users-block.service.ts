import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ERROR_MESSAGES } from '../../../commons/messages';
import { ApiUpdateBaseService } from '../../../commons/services/api/api-update.base.service';
import { ClientData } from '../../auth/auth.type';
import { User, UserModel } from '../../../models';
import { MongoConnection } from '../../../models/mongo.connection';
import { BlockUserDto } from '../dto/block-user.dto';

@Injectable()
export class UsersBlockService extends ApiUpdateBaseService {
  constructor(
    private readonly userModel: UserModel,
    private readonly mongoConnection: MongoConnection,
  ) {
    super();
  }

  public async run(payload: BlockUserDto, client: ClientData): Promise<void> {
    const { _currentUserId, currentUserId } = this.getClient(client);
    const _targetUserId = this.getObjectId(payload.targetUserId);
    const [currentUser] = await Promise.all([
      this.userModel.findOneOrFailById(_currentUserId, {
        _id: true,
        _blockedIds: true,
      }),
      this.userModel.findOneOrFailById(_targetUserId, { _id: true }),
    ]);
    this.verifyCanBlock(currentUser);
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
  }

  private verifyCanBlock(user: User) {
    if (user._blockedIds && user._blockedIds?.length >= 100) {
      throw new BadRequestException(
        ERROR_MESSAGES['You can only block maximum 100 users'],
      );
    }
  }
}
