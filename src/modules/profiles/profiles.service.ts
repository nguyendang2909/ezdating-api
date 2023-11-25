import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { UpdateQuery } from 'mongoose';

import { ERROR_MESSAGES } from '../../commons/messages';
import { RESPONSE_TYPES } from '../../constants';
import { FilesService } from '../../libs';
import { ClientData } from '../auth/auth.type';
import { UploadPhotoDtoDto } from '../media-files/dto/upload-photo.dto';
import {
  BasicProfile,
  BasicProfileModel,
  MediaFileModel,
  Profile,
  ProfileFilterModel,
  ProfileModel,
  StateModel,
} from '../models';
import { MediaFile } from '../models/schemas/media-file.schema';
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
    const basicProfile = await this.basicProfileModel.findOneAndUpdateById(
      _currentUserId,
      {
        _id: _currentUserId,
        ...rest,
        state,
        birthday,
        ...(longitude && latitude
          ? {
              geolocation: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            }
          : {}),
      },
      { new: true, upsert: true },
    );
    if (!basicProfile) {
      throw new InternalServerErrorException();
    }
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

  async createProfile(basicProfile: BasicProfile, mediaFile: MediaFile) {
    await this.profileModel.createOne({
      ...basicProfile,
      mediaFiles: [
        {
          _id: mediaFile._id,
          key: mediaFile.key,
          type: mediaFile.type,
        },
      ],
    });
    await this.basicProfileModel.deleteOne(basicProfile._id).catch((error) => {
      this.logger.error(
        `Failed to remove basic profile ${basicProfile._id.toString()} with error ${JSON.stringify(
          error,
        )}`,
      );
    });
  }

  public async uploadBasicPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    client: ClientData,
  ) {
    const { _currentUserId } = this.getClient(client);
    let { profile, basicProfile } = await this.tryFindProfileAndBasicProfile(
      _currentUserId,
    );
    if (profile) {
      this.profileModel.verifyCanUploadFiles(profile);
    }
    const mediaFile = await this.filesService.createPhoto(file, _currentUserId);
    if (profile) {
      await this.filesService.updateProfileAfterCreatePhoto(
        mediaFile,
        _currentUserId,
      );
      return mediaFile;
    }
    if (basicProfile) {
      try {
        await this.createProfile(basicProfile, mediaFile);
      } catch (error) {
        profile = await this.profileModel.findOneById(_currentUserId);
        if (!profile) {
          await this.filesService.removeMediaFileAndCatch(mediaFile);
          throw new NotFoundException(ERROR_MESSAGES['Profile does not exist']);
        }
        await this.filesService.updateProfileAfterCreatePhoto(
          mediaFile,
          _currentUserId,
        );
      }
    }
    return mediaFile;
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

  async tryFindProfileAndBasicProfile(_currentUserId: mongoose.Types.ObjectId) {
    let [profile, basicProfile] = await Promise.all([
      this.profileModel.findOneById(_currentUserId),
      this.basicProfileModel.findOneById(_currentUserId),
    ]);
    if (!profile && !basicProfile) {
      [profile, basicProfile] = await Promise.all([
        this.profileModel.findOneById(_currentUserId),
        this.basicProfileModel.findOneById(_currentUserId),
      ]);
      if (!profile && !basicProfile) {
        throw new NotFoundException(ERROR_MESSAGES['Profile does not exist']);
      }
    }
    return { profile, basicProfile };
  }
}
