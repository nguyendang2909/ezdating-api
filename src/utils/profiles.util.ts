import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { MongoGeoLocation } from '../models';
import { ERROR_MESSAGES } from '../commons/messages';
import { DATE_FORMATS } from '../constants';
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
}
