import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import moment from 'moment';
import { UpdateQuery } from 'mongoose';

import { AppConfig } from '../../app.config';
import {
  UserGender,
  UserGenders,
  UserStatuses,
  WeeklyCoins,
  WeeklyCoinsLength,
} from '../../commons/constants/constants';
import { ClientData } from '../auth/auth.type';
import { CoinAttendanceModel } from '../models/coin-attendance.model';
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
    private readonly coinAttendanceModel: CoinAttendanceModel,
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
      .addFields({
        age: {
          $dateDiff: {
            startDate: '$birthday',
            endDate: '$$NOW',
            unit: 'year',
          },
        },
      })
      .project({
        birthday: false,
        password: false,
      })
      .limit(1)
      .exec();

    return user;
  }

  public async updateProfile(
    payload: UpdateMyProfileDto,
    currentUserId: string,
  ): Promise<boolean> {
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

  public async takeAttendance(clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const todayDate = moment().startOf('date').toDate();

    const lastCoinAttendance = await this.coinAttendanceModel.model
      .findOne({
        _userId: _currentUserId,
      })
      .lean()
      .exec();

    if (!lastCoinAttendance) {
      // TODO: transaction
      await this.coinAttendanceModel.model.create({
        _userId: _currentUserId,
        receivedDate: todayDate,
        value: 10,
        receivedDateIndex: 0,
      });

      await this.userModel.model.updateOne(
        {
          _id: _currentUserId,
        },
        {
          $inc: {
            coins: WeeklyCoins[0],
          },
        },
      );
    } else {
      const lastReceivedDayIndex = WeeklyCoins.findIndex(
        (item) => item === lastCoinAttendance.value,
      );
      const newReceiveDayIndex =
        lastReceivedDayIndex !== WeeklyCoinsLength - 1
          ? lastReceivedDayIndex + 1
          : 0;

      await this.coinAttendanceModel.model.create({
        _userId: _currentUserId,
        receivedDate: todayDate,
        receivedDateIndex: newReceiveDayIndex,
        value: WeeklyCoins[newReceiveDayIndex || 0],
      });
    }
  }

  getFilterGender(gender: UserGender) {
    if (gender === UserGenders.male) {
      return UserGenders.female;
    }

    return UserGenders.male;
  }
}
