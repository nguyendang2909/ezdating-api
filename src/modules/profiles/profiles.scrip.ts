import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';

import { GENDERS, USER_ROLES, USER_STATUSES } from '../../constants';
import {
  EducationLevel,
  RelationshipGoal,
  RelationshipStatus,
} from '../../types';
import { ProfileModel, UserModel } from '../models';
import { ProfilesCommonService } from './profiles.common.service';

@Injectable()
export class ProfilesScript extends ProfilesCommonService {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  private logger = new Logger(ProfilesScript.name);

  onApplicationBootstrap() {
    this.createProfiles();
  }

  async createProfiles() {
    if (process.env.NODE_ENV !== 'production') {
      const sampleProfiles = await this.profileModel.findMany(
        {
          gender: GENDERS.FEMALE,
          mediaFileCount: 1,
        },
        {},
        { limit: 100 },
      );
      const sampleMediaFiles = sampleProfiles
        .filter((e) => e.mediaFiles?.length === 1)
        .flatMap((e) => {
          return e.mediaFiles;
        });

      for (let index = 0; index < 1000000; index++) {
        this.logger.log('Create user');
        try {
          const user = await this.userModel.createOne({
            email: faker.internet.email(),
            role: USER_ROLES.MEMBER,
            status: USER_STATUSES.ACTIVATED,
          });
          const mediaFiles = faker.helpers.arrayElements(sampleMediaFiles, {
            min: 1,
            max: 6,
          });
          await this.profileModel.createOne({
            _id: user._id,
            birthday: faker.date.between({
              from: moment().subtract(30, 'years').toDate(),
              to: moment().subtract(25, 'years').toDate(),
            }),
            company: faker.company.name(),
            educationLevel: faker.number.int({
              min: 1,
              max: 7,
            }) as EducationLevel,
            filterGender: GENDERS.MALE,
            filterMaxAge: 99,
            filterMaxDistance: 100,
            filterMinAge: 18,
            gender: GENDERS.FEMALE,
            geolocation: {
              type: 'Point',
              coordinates: [
                faker.location.longitude(),
                faker.location.latitude(),
              ],
            },
            height: faker.number.int({ min: 140, max: 180 }),
            hideAge: false,
            hideDistance: false,
            introduce: faker.word.words(),
            jobTitle: faker.name.jobTitle(),
            languages: [faker.location.country()],
            lastActivatedAt: faker.date.between({
              from: moment().subtract(100, 'minutes').toDate(),
              to: moment().subtract(1, 'minutes').toDate(),
            }),
            mediaFileCount: mediaFiles.length,
            mediaFiles: mediaFiles,
            nickname: faker.person.fullName(),
            relationshipGoal: faker.number.int({
              min: 1,
              max: 5,
            }) as RelationshipGoal,
            relationshipStatus: faker.number.int({
              min: 1,
              max: 6,
            }) as RelationshipStatus,
            school: faker.company.name(),
            weight: faker.number.int({ min: 40, max: 100 }),
          });
        } catch (err) {
          this.logger.error(`Create user failed: ${JSON.stringify(err)}`);
        }
      }
    }
  }
}
