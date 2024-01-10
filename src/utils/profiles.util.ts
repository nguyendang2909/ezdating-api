import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../app.config';
import { ERROR_MESSAGES } from '../commons/messages';
import { DATE_FORMATS } from '../constants';
import { MongoGeoLocation, Profile } from '../models';
import { BaseUtil } from './bases/base.util';

@Injectable()
export class ProfilesUtil extends BaseUtil {
  verifyBirthdayFromRaw(rawBirthday: string): Date {
    const birthdayMoment = moment(rawBirthday, DATE_FORMATS.RAW_BIRTHDAY).utc(
      true,
    );
    const momentNow = moment();
    const age = momentNow.diff(birthdayMoment, 'years', true);
    if (age < 18) {
      throw new BadRequestException(
        ERROR_MESSAGES['Please make sure you are over 18 years old'],
      );
    }
    if (age > 100) {
      throw new BadRequestException(
        ERROR_MESSAGES['Please make sure you are under 100 years old'],
      );
    }
    return birthdayMoment.toDate();
  }

  getGeolocationFromQueryParams(payload: {
    latitude: string;
    longitude: string;
  }): MongoGeoLocation {
    return {
      type: 'Point',
      coordinates: [+payload.longitude, +payload.latitude],
    };
  }

  getAgeFromBirthday(birthday: Date): number {
    return moment().diff(birthday, 'years');
  }

  public verifyCanUploadFiles(profile: Profile): number {
    const count = profile.mediaFiles?.length || 0;
    if (count >= APP_CONFIG.UPLOAD_PHOTOS_LIMIT) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['You can only upload 6 media files'],
      });
    }
    return count;
  }

  public verifyNotSameById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['You cannot like yourself'],
      });
    }
  }
}
