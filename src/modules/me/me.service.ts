import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import moment from 'moment';
import { UpdateQuery } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import {
  UserGender,
  UserGenders,
  UserStatuses,
  WeeklyCoins,
  WeeklyCoinsLength,
} from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ClientData } from '../auth/auth.type';
import { CoinAttendanceModel } from '../models/coin-attendance.model';
import { MatchModel } from '../models/match.model';
import { MediaFileModel } from '../models/media-file.model';
import { CoinAttendanceDocument } from '../models/schemas/coin-attendance.schema';
import { UserDocument } from '../models/schemas/user.schema';
import { UserModel } from '../models/user.model';
import { UsersCommonService } from '../users/users.common.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-me-basic-info.dto';

@Injectable()
export class MeService extends UsersCommonService {
  constructor(
    private readonly userModel: UserModel,
    private readonly mediaFileModel: MediaFileModel,
    // private readonly stateModel: StateModel,
    private readonly coinAttendanceModel: CoinAttendanceModel,
    // private readonly countryModel: CountryModel,
    private readonly matchModel: MatchModel,
  ) {
    super();
  }

  public async get(clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);

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
          { $limit: APP_CONFIG.PAGINATION_LIMIT.MEDIA_FILES },
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
        password: false,
      })
      .limit(1)
      .exec();

    return user;
  }

  public async updateProfile(
    payload: UpdateMeDto,
    clientData: ClientData,
  ): Promise<boolean> {
    const {
      longitude,
      latitude,
      birthday: rawBirthday,
      ...updateDto
    } = payload;

    const _currentUserId = this.getObjectId(clientData.id);

    const birthday = rawBirthday
      ? this.getAndCheckValidBirthdayFromRaw(rawBirthday)
      : undefined;

    const updateOptions: UpdateQuery<UserDocument> = {
      $set: {
        ...updateDto,
        ...(birthday ? { birthday } : {}),
        ...(longitude && latitude
          ? {
              geolocation: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            }
          : {}),
      },
    };

    return await this.userModel.updateOneById(_currentUserId, updateOptions);
  }

  public async updateProfileBasicInfo(
    payload: UpdateMyProfileBasicInfoDto,
    req: Request,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    await this.userModel.findOneOrFail({ _id: _currentUserId });

    const { birthday: rawBirthday, ...updateDto } = payload;
    const birthday = this.getAndCheckValidBirthdayFromRaw(rawBirthday);
    const age = moment().diff(birthday, 'years');

    return await this.userModel.updateOneById(_currentUserId, {
      $set: {
        ...updateDto,
        filterGender: this.getFilterGender(payload.gender),
        filterMinAge: age - 10 > 18 ? age - 10 : 18,
        filterMaxAge: age + 10,
        filterMaxDistance: APP_CONFIG.USER_FILTER_MAX_DISTANCE,
        status: UserStatuses.activated,
      },
    });
  }

  public async deactivate(clientData: ClientData) {
    const _currentUserId = this.getObjectId(clientData.id);

    return await this.userModel.updateOneById(_currentUserId, {
      $set: {
        status: UserStatuses.deactivated,
      },
    });
  }

  public async takeAttendance(
    clientData: ClientData,
  ): Promise<CoinAttendanceDocument> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const todayDate = moment().startOf('date').toDate();

    const lastCoinAttendance = await this.coinAttendanceModel.model
      .findOne({
        _userId: _currentUserId,
      })
      .lean()
      .exec();

    if (!lastCoinAttendance) {
      // TODO: transaction
      const firstCoinAttendance = await this.coinAttendanceModel.model.create({
        _userId: _currentUserId,
        receivedDate: todayDate,
        value: WeeklyCoins[0],
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

      return firstCoinAttendance;
    }

    if (moment(lastCoinAttendance.receivedDate).isSame(moment(todayDate))) {
      throw new BadRequestException({
        message: HttpErrorMessages['You already got attendance today'],
      });
    }

    const lastReceivedDayIndex = WeeklyCoins.findIndex(
      (item) => item === lastCoinAttendance.value,
    );
    const newReceiveDayIndex =
      lastReceivedDayIndex !== WeeklyCoinsLength - 1
        ? lastReceivedDayIndex + 1
        : 0;

    const createResult = await this.coinAttendanceModel.model.create({
      _userId: _currentUserId,
      receivedDate: todayDate,
      receivedDateIndex: newReceiveDayIndex,
      value: WeeklyCoins[newReceiveDayIndex || 0],
    });

    return createResult;
  }

  getFilterGender(gender: UserGender) {
    if (gender === UserGenders.male) {
      return UserGenders.female;
    }

    return UserGenders.male;
  }
}