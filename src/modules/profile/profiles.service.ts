import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import moment from 'moment';
import { MoreThan } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import {
  CoinTypes,
  UserStatuses,
  WeeklyCoins,
  WeeklyCoinsLength,
} from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { CoinHistoryModel } from '../entities/coinHistory.model';
import { User } from '../entities/entities/user.entity';
import { StateModel } from '../entities/state.model';
import { UploadFileModel } from '../entities/upload-file.model';
import { UserModel } from '../entities/user.model';
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
            geolocation: {
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
    req: Request,
    currentUserId: string,
  ) {
    const { ...updateDto } = payload;
    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      haveBasicInfo: true,
    };
    return await this.userModel.updateOneById(currentUserId, updateOptions);
  }

  public async deactivate(userId: string) {
    return await this.userModel.updateOneById(userId, {
      status: UserStatuses.activated,
    });
  }

  public async getDailyCoin(clientData: ClientData) {
    const now = moment().startOf('date').toDate();
    const lastDailyCoin = await this.coinHistoryModel.findOne({
      where: {
        user: {
          id: clientData.id,
        },
        type: CoinTypes.daily,
        receivedAt: MoreThan(now),
      },
    });
    if (!lastDailyCoin) {
      // TODO: transaction
      await this.coinHistoryModel.saveOne({
        user: {
          id: clientData.id,
        },
        type: CoinTypes.daily,
        receivedAt: now,
        value: WeeklyCoins[0],
      });
      await this.userModel.updateOneById(clientData.id, {
        coins: () => 'coins + 10',
      });
    }
    if (lastDailyCoin) {
      const lastDate = moment(lastDailyCoin.receivedAt).startOf('date');
      if (moment(now).diff(lastDate, 'd') < 1) {
        throw new BadRequestException({
          errorCode: HttpErrorCodes.DAILY_COIN_ALREADY_RECEIVED,
          message: 'You already received daily coin!',
        });
      }
      const lastReceivedDay = WeeklyCoins.findIndex(
        (item) => item === lastDailyCoin.value,
      );
      const newReceiveDay =
        lastReceivedDay && lastReceivedDay !== WeeklyCoinsLength - 1
          ? lastReceivedDay + 1
          : 0;
      const value = WeeklyCoins[newReceiveDay] || 10;

      return await this.coinHistoryModel.saveOne({
        user: {
          id: clientData.id,
        },
        type: CoinTypes.daily,
        receivedAt: now,
        value,
      });
    }
  }
}
