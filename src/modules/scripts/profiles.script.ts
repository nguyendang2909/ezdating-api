import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';

import { GENDERS, USER_ROLES, USER_STATUSES } from '../../constants';
import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { EmbeddedMediaFile, ProfileModel, UserModel } from '../models';
import { ApiScript } from './api.script';

@Injectable()
export class ProfilesScript {
  baseUrl: string;
  api: AxiosInstance;

  constructor(
    private readonly profileModel: ProfileModel,
    private readonly userModel: UserModel,
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly apiScript: ApiScript,
  ) {}

  private logger = new Logger(ApiScript.name);

  onApplicationBootstrap() {
    this.createProfilesFemale().catch((err) => {
      this.logger.error(JSON.stringify(err));
    });
  }

  async createProfilesFemale() {
    if (process.env.NODE_ENV === 'staging') {
      const targetUser = await this.userModel.findOneOrFail({
        phoneNumber: '+84971016191',
      });
      const { mediaFiles } = await this.getSampleData();
      for (let index = 0; index < 10000000; index++) {
        this.logger.log('Create user');
        try {
          const user = await this.userModel.createOne({
            email: faker.internet.email(),
            role: USER_ROLES.MEMBER,
            status: USER_STATUSES.ACTIVATED,
          });
          const accessToken = this.encryptionsUtil.signAccessToken({
            id: user._id.toString(),
            role: user.role,
            sub: user._id.toString(),
          });
          this.apiScript.init(accessToken);
          await this.apiScript.createProfile();
          await this.apiScript.updateProfile();
          const randomMediaFiles = this.getRandomMediaFiles(mediaFiles);
          await this.profileModel.updateOneById(user._id, {
            $set: {
              mediaFiles: randomMediaFiles,
            },
          });

          await this.apiScript.sendLike({
            targetUserId: targetUser._id.toString(),
          });
        } catch (err) {
          this.logger.error(`Create user failed: ${JSON.stringify(err)}`);
        }
      }
    }
  }

  // async createProfilesMale() {
  //   if (process.env.NODE_ENV === 'staging') {
  //     const sampleProfiles = await this.profileModel.findMany(
  //       {
  //         gender: GENDERS.MALE,
  //       },
  //       {},
  //       { limit: 100 },
  //     );
  //     const sampleMediaFiles = sampleProfiles
  //       .filter((e) => e.mediaFiles?.length === 1)
  //       .flatMap((e) => {
  //         return e.mediaFiles;
  //       });

  //     for (let index = 0; index < 1; index++) {
  //       this.logger.log('Create user');
  //       try {
  //         const user = await this.userModel.createOne({
  //           email: faker.internet.email(),
  //           role: USER_ROLES.MEMBER,
  //           status: USER_STATUSES.ACTIVATED,
  //         });
  //         const mediaFiles = faker.helpers.arrayElements(sampleMediaFiles, {
  //           min: 1,
  //           max: 6,
  //         });
  //         await this.profileModel.createOne({
  //           _id: user._id,
  //           birthday: faker.date.between({
  //             from: moment().subtract(30, 'years').toDate(),
  //             to: moment().subtract(25, 'years').toDate(),
  //           }),
  //           company: faker.company.name(),
  //           educationLevel: faker.number.int({
  //             min: 1,
  //             max: 7,
  //           }) as EducationLevel,
  //           filterGender: GENDERS.FEMALE,
  //           filterMaxAge: 99,
  //           filterMaxDistance: 100,
  //           filterMinAge: 18,
  //           gender: GENDERS.MALE,
  //           geolocation: {
  //             type: 'Point',
  //             coordinates: [
  //               faker.location.longitude(),
  //               faker.location.latitude(),
  //             ],
  //           },
  //           height: faker.number.int({ min: 155, max: 190 }),
  //           hideAge: false,
  //           hideDistance: false,
  //           introduce: faker.word.words(),
  //           jobTitle: faker.name.jobTitle(),
  //           languages: [faker.location.country()],
  //           lastActivatedAt: faker.date.between({
  //             from: moment().subtract(100, 'minutes').toDate(),
  //             to: moment().subtract(1, 'minutes').toDate(),
  //           }),
  //           mediaFiles: mediaFiles,
  //           nickname: faker.person.fullName(),
  //           relationshipGoal: faker.number.int({
  //             min: 1,
  //             max: 5,
  //           }) as RelationshipGoal,
  //           relationshipStatus: faker.number.int({
  //             min: 1,
  //             max: 6,
  //           }) as RelationshipStatus,
  //           school: faker.company.name(),
  //           weight: faker.number.int({ min: 45, max: 110 }),
  //         });
  //       } catch (err) {
  //         this.logger.error(`Create user failed: ${JSON.stringify(err)}`);
  //       }
  //     }
  //   }
  // }

  async getSampleData() {
    const sampleProfiles = await this.profileModel.findMany(
      {
        gender: GENDERS.FEMALE,
        mediaFiles: { $size: { $gt: 0 } },
      },
      {},
      { limit: 100 },
    );
    const mediaFiles = sampleProfiles
      .filter((e) => e.mediaFiles?.length > 0)
      .flatMap((e) => {
        return e.mediaFiles;
      });

    return { mediaFiles };
  }

  getRandomMediaFiles(mediaFiles: EmbeddedMediaFile[]) {
    return faker.helpers.arrayElements(mediaFiles, {
      min: 1,
      max: 6,
    });
  }
}
