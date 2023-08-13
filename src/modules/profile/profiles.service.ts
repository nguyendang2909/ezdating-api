import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import _ from 'lodash';
import moment from 'moment';
import { UpdateQuery } from 'mongoose';

import { AppConfig } from '../../app.config';
import {
  UserGender,
  UserGenders,
  UserStatuses,
} from '../../commons/constants/constants';
import { MediaFileModel } from '../models/media-file.model';
import { RelationshipModel } from '../models/relationship.model';
import { UserDocument } from '../models/schemas/user.schema';
import { UserModel } from '../models/user.model';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userModel: UserModel,
    private readonly mediaFileModel: MediaFileModel,
    // private readonly stateModel: StateModel,
    // private readonly coinHistoryModel: CoinHistoryModel,
    // private readonly countryModel: CountryModel,
    private readonly relationshipModel: RelationshipModel,
  ) {}

  public async getProfile(currentUserId: string) {
    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const [user] = await this.userModel.model
      .aggregate()
      .match({
        _id: _currentUserId,
      })
      .lookup({
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
      })
      .limit(1)
      .exec();

    return _.omit(user, ['password']);
  }

  public async updateProfile(
    payload: UpdateMyProfileDto,
    currentUserId: string,
  ) {
    const { longitude, latitude, ...updateDto } = payload;

    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const updateOptions: UpdateQuery<UserDocument> = {
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

    // if (stateId) {
    //   await this.stateModel.findOneOrFail({
    //     where: { id: stateId },
    //   });
    //   updateOptions.state = {
    //     id: stateId,
    //   };
    // }

    return await this.userModel.updateOneById(_currentUserId, updateOptions);
  }

  public async updateProfileBasicInfo(
    payload: UpdateMyProfileBasicInfoDto,
    req: Request,
    currentUserId: string,
  ) {
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    await this.userModel.findOneOrFail({ _id: _currentUserId });
    const age = moment().diff(moment(payload.birthday, 'YYYY-MM-DD'), 'years');
    const { ...updateDto } = payload;

    return await this.userModel.updateOneById(_currentUserId, {
      ...updateDto,
      filterGender: this.getFilterGender(payload.gender),
      filterMinAge: age - 10 > 18 ? age - 10 : 18,
      filterMaxAge: age + 10,
      filterMaxDistance: AppConfig.USER_FILTER_MAX_DISTANCE,
      status: UserStatuses.activated,
    });
  }

  public async deactivate(currentUserId: string) {
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    return await this.userModel.updateOneById(_currentUserId, {
      status: UserStatuses.deactivated,
    });
  }

  //   public async getDailyCoin(clientData: ClientData) {
  //     const now = moment().startOf('date').toDate();
  //     const lastDailyCoin = await this.coinHistoryModel.findOne({
  //       where: {
  //         user: {
  //           id: clientData.id,
  //         },
  //         type: CoinTypes.daily,
  //         receivedAt: MoreThan(now),
  //       },
  //     });
  //     if (!lastDailyCoin) {
  //       // TODO: transaction
  //       await this.coinHistoryModel.saveOne({
  //         user: {
  //           id: clientData.id,
  //         },
  //         type: CoinTypes.daily,
  //         receivedAt: now,
  //         value: WeeklyCoins[0],
  //       });
  //       await this.userModel.updateOneById(clientData.id, {
  //         coins: () => 'coins + 10',
  //       });
  //     }
  //     if (lastDailyCoin) {
  //       const lastDate = moment(lastDailyCoin.receivedAt).startOf('date');
  //       if (moment(now).diff(lastDate, 'd') < 1) {
  //         throw new BadRequestException({
  //           errorCode: HttpErrorCodes.DAILY_COIN_ALREADY_RECEIVED,
  //           message: 'You already received daily coin!',
  //         });
  //       }
  //       const lastReceivedDay = WeeklyCoins.findIndex(
  //         (item) => item === lastDailyCoin.value,
  //       );
  //       const newReceiveDay =
  //         lastReceivedDay && lastReceivedDay !== WeeklyCoinsLength - 1
  //           ? lastReceivedDay + 1
  //           : 0;
  //       const value = WeeklyCoins[newReceiveDay] || 10;

  //       return await this.coinHistoryModel.saveOne({
  //         user: {
  //           id: clientData.id,
  //         },
  //         type: CoinTypes.daily,
  //         receivedAt: now,
  //         value,
  //       });
  //     }
  //   }

  getFilterGender(gender: UserGender) {
    if (gender === UserGenders.male) {
      return UserGenders.female;
    }

    return UserGenders.male;
  }
}
