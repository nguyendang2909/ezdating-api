import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import moment from 'moment';

import { GENDERS } from '../../constants';
import { API_ENDPOINTS } from '../../constants/fe.constants';
import {
  ApiRequest,
  EducationLevel,
  Gender,
  RelationshipGoal,
  RelationshipStatus,
} from '../../types';
import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { Profile, ProfileFilter, ProfileModel, UserModel } from '../models';
import { UpdateMyProfileDto } from '../profiles/dto';
import { ProfilesCommonService } from '../profiles/profiles.common.service';

@Injectable()
export class ApiScript extends ProfilesCommonService {
  baseUrl: string;
  api: AxiosInstance;

  constructor(
    private readonly profileModel: ProfileModel,
    private readonly userModel: UserModel,
    private readonly encryptionsUtil: EncryptionsUtil,
  ) {
    super();

    this.api = axios.create({
      baseURL: this.baseUrl,
    });
    this.baseUrl = `${
      process.env.NODE_ENV === 'development' ? 'https' : 'http'
    }://localhost:${process.env.API_PORT}`;
  }

  init(accessToken: string) {
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return this.api;
  }

  private logger = new Logger(ApiScript.name);

  async createProfile(options?: { gender?: Gender }) {
    const { data } = await this.api.post<{
      data: { profile: Profile; profileFilter: ProfileFilter };
    }>('/profiles/me', {
      birthday: moment(
        faker.date.between({
          from: moment().subtract(30, 'years').toDate(),
          to: moment().subtract(25, 'years').toDate(),
        }),
      ).format('YYYY-MM-DD'),
      gender: options?.gender || GENDERS.FEMALE,
      introduce: faker.word.words(),
      nickname: faker.person.fullName(),
      relationshipGoal: faker.number.int({
        min: 1,
        max: 5,
      }) as RelationshipGoal,
      stateId: '65574d3c942d1c7185fb339d',
    });
    return data;
  }

  async updateProfile() {
    const updateData: UpdateMyProfileDto = {
      company: faker.company.name(),
      educationLevel: faker.number.int({
        min: 1,
        max: 7,
      }) as EducationLevel,
      height: faker.number.int({ min: 140, max: 180 }),
      hideAge: false,
      hideDistance: false,
      jobTitle: faker.name.jobTitle(),
      languages: [faker.location.country()],
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      relationshipStatus: faker.number.int({
        min: 1,
        max: 6,
      }) as RelationshipStatus,
      school: faker.company.name(),
      weight: faker.number.int({ min: 40, max: 100 }),
    };
    await this.api.patch<void>('/profiles/me', updateData);
  }

  async sendLike(body: ApiRequest.SendLike) {
    return await this.api.post<void>(API_ENDPOINTS.LIKES, body);
  }
}
