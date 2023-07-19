import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';
import { MoreThan } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { CoinTypes, UserStatuses } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { CoinHistoryModel } from '../entities/coinHistory.model';
import { User } from '../entities/entities/user.entity';
import { StateModel } from '../entities/state.model';
import { UploadFileModel } from '../entities/upload-file.model';
import { UserModel } from '../entities/users.model';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userModel: UserModel,
    private readonly uploadFileModel: UploadFileModel,
    private readonly stateModel: StateModel,
    private readonly coinHistoryModel: CoinHistoryModel, // private readonly countryModel: CountryModel,
  ) {}

  public async getProfile(currentUserId: string) {
    // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...userPart } = await this.userModel.findOneOrFail({
      where: {
        id: currentUserId,
      },
      relations: {
        uploadFiles: true,
        avatarFile: true,
      },
    });

    const formattedProfile = {
      ...userPart,
      avatar: userPart.avatarFile?.location,
    };

    return formattedProfile;
  }

  public async updateProfile(
    payload: UpdateMyProfileDto,
    currentUserId: string,
  ) {
    const { avatarFileId, longitude, latitude, stateId, ...updateDto } =
      payload;

    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      ...(longitude && latitude
        ? {
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          }
        : {}),
    };

    if (avatarFileId) {
      await this.uploadFileModel.findOneOrFail({
        where: {
          id: avatarFileId,
          user: {
            id: currentUserId,
          },
        },
      });
      updateOptions.avatarFile = { id: avatarFileId };
    }

    if (stateId) {
      await this.stateModel.findOneOrFail({
        where: { id: stateId },
      });
      updateOptions.state = {
        id: stateId,
      };
    }

    return await this.userModel.updateOneById(currentUserId, updateOptions);
  }

  public async updateProfileBasicInfo(
    payload: UpdateMyProfileBasicInfoDto,
    currentUserId: string,
  ) {
    const { stateId, ...updateDto } = payload;
    await this.stateModel.findOneOrFail({
      where: { id: stateId },
    });
    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      state: { id: stateId },
      haveBasicInfo: true,
    };
    return await this.userModel.updateOneById(currentUserId, updateOptions);
  }

  public async deactivate(userId: string) {
    return await this.userModel.updateOneById(userId, {
      status: UserStatuses.activated,
    });
  }

  public async getDailyCoin(user: User) {
    const now = moment().startOf('date').toDate();
    const existDailyCoin = await this.coinHistoryModel.findOne({
      where: {
        user: {
          id: user.id,
        },
        type: CoinTypes.daily,
        receivedAt: MoreThan(now),
      },
    });
    if (existDailyCoin) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.DAILY_COIN_ALREADY_RECEIVED,
        message: 'You already received daily coin!',
      });
    }
    // TODO: transaction
    await this.coinHistoryModel.saveOne({
      user: {
        id: user.id,
      },
      type: CoinTypes.daily,
      receivedAt: now,
    });
    await this.userModel.updateOneById(user.id, {
      coins: () => 'coins + 10',
    });

    return;
  }
}
