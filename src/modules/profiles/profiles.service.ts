import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';

import { ERROR_MESSAGES } from '../../commons/messages';
import { RESPONSE_TYPES } from '../../constants';
import { FilesService } from '../../libs';
import { ClientData } from '../auth/auth.type';
import { UploadPhotoDtoDto } from '../media-files/dto/upload-photo.dto';
import {
  BasicProfileModel,
  MediaFileModel,
  Profile,
  ProfileFilterModel,
  ProfileModel,
  StateModel,
} from '../models';
import { CreateBasicProfileDto } from './dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ProfilesCommonService } from './profiles.common.service';

@Injectable()
export class ProfilesService extends ProfilesCommonService {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly profileFilterModel: ProfileFilterModel,
    private readonly stateModel: StateModel,
    private readonly basicProfileModel: BasicProfileModel,
    private readonly filesService: FilesService,
    private readonly mediaFileModel: MediaFileModel,
  ) {
    super();
  }

  private readonly logger = new Logger(ProfilesService.name);

  public async createBasic(payload: CreateBasicProfileDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    await this.basicProfileModel.findOneAndFailById(_currentUserId);
    await this.profileModel.findOneAndFailById(_currentUserId);
    const {
      birthday: rawBirthday,
      stateId,
      latitude,
      longitude,
      ...rest
    } = payload;
    const state = await this.stateModel.findOneOrFailById(
      this.getObjectId(stateId),
    );
    const birthday = this.getAndCheckValidBirthdayFromRaw(rawBirthday);
    const basicProfile = await this.basicProfileModel.createOne({
      _id: _currentUserId,
      ...rest,
      state,
      birthday,
      ...(longitude && latitude
        ? { geolocation: { type: 'Point', coordinates: [longitude, latitude] } }
        : {}),
    });
    await this.profileFilterModel
      .createOneFromProfile(basicProfile)
      .catch((error) => {
        this.logger.error(
          `Failed to create profile filter from profile: ${JSON.stringify(
            basicProfile,
          )} with error ${JSON.stringify(error)}`,
        );
      });
    return basicProfile;
  }

  public async uploadBasicPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    client: ClientData,
  ) {
    const { _currentUserId } = this.getClient(client);
    // eslint-disable-next-line prefer-const
    let [profile, basicProfile] = await Promise.all([
      this.profileModel.findOneById(_currentUserId),
      this.basicProfileModel.findOneById(_currentUserId),
    ]);
    if (!profile && basicProfile) {
      try {
        profile = await this.profileModel.createOne(basicProfile);
        await this.basicProfileModel
          .deleteOne(_currentUserId)
          .catch((error) => {
            this.logger.error(
              `Failed to remove basic profile ${_currentUserId} with error ${JSON.stringify(
                error,
              )}`,
            );
          });
      } catch (error) {
        profile = await this.profileModel.findOneOrFailById(_currentUserId);
      }
    }
    if (!profile) {
      throw new NotFoundException(ERROR_MESSAGES['Profile does not exist']);
    }
    this.profileModel.verifyCanUploadFiles(profile);
    return await this.filesService.createPhoto(file, _currentUserId);
  }

  public async getMe(clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const profile = await this.profileModel.findOneById(_currentUserId);
    if (!profile) {
      return await this.basicProfileModel.findOneOrFailById(_currentUserId);
    }
    return profile;
  }

  async findOneOrFailById(id: string, _client: ClientData) {
    const _id = this.getObjectId(id);
    const findResult = await this.profileModel.findOneOrFailById(_id);
    return {
      type: RESPONSE_TYPES.PROFILE,
      data: findResult,
    };
  }

  public async updateMe(payload: UpdateMyProfileDto, client: ClientData) {
    const {
      longitude,
      latitude,
      birthday: rawBirthday,
      stateId,
      ...updateDto
    } = payload;
    const { _currentUserId } = this.getClient(client);
    const updateOptions: UpdateQuery<Profile> = {
      $set: {
        ...updateDto,
        ...(rawBirthday
          ? {
              birthday: this.getAndCheckValidBirthdayFromRaw(rawBirthday),
            }
          : {}),
        ...(longitude && latitude
          ? {
              geolocation: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            }
          : {}),
        ...(stateId
          ? {
              state: await this.stateModel.findOneOrFailById(
                this.getObjectId(stateId),
              ),
            }
          : {}),
      },
    };
    await this.profileModel.updateOneById(_currentUserId, updateOptions);
  }
}
