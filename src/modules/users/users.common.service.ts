import { BadRequestException } from '@nestjs/common';
import moment from 'moment';

import { ERROR_MESSAGES } from '../../commons/messages';
import { ApiService } from '../../commons/services/api.service';
import { DATE_FORMATS } from '../../constants/common.constants';

export class UsersCommonService extends ApiService {
  getAndCheckValidBirthdayFromRaw(rawBirthday: string): Date {
    const birthdayMoment = moment(rawBirthday, DATE_FORMATS.RAW_BIRTHDAY).utc(
      true,
    );

    if (birthdayMoment) {
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
    }

    return birthdayMoment.toDate();
  }
}
