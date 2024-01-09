import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';

import { ApiWriteService } from '../../../commons';
import { ERROR_MESSAGES } from '../../../commons/messages';
import { FilesService } from '../../../libs';
import { ProfilesUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { UploadPhotoDtoDto } from '../../media-files/dto/upload-photo.dto';
import {
  BasicProfile,
  BasicProfileModel,
  Profile,
  ProfileFilterModel,
  ProfileModel,
  StateModel,
  UserModel,
} from '../../../models';
import { MongoConnection } from '../../../models/mongo.connection';
import { MediaFile } from '../../../models/schemas/media-file.schema';
import { CreateBasicProfileDto } from '../dto';

@Injectable()
export class BasicProfileWriteService extends ApiWriteService<
  BasicProfile | Profile,
  CreateBasicProfileDto
> {
  constructor(
    protected readonly basicProfileModel: BasicProfileModel,
    protected readonly profileModel: ProfileModel,
    protected readonly profileFilterModel: ProfileFilterModel,
    protected readonly stateModel: StateModel,
    protected readonly profilesUtil: ProfilesUtil,
    private readonly mongoConnection: MongoConnection,
    private readonly userModel: UserModel,
    private readonly filesService: FilesService,
  ) {
    super();
  }

  public async createOne(
    payload: CreateBasicProfileDto,
    client: ClientData,
  ): Promise<BasicProfile> {
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
    const birthday = this.profilesUtil.verifyBirthdayFromRaw(rawBirthday);
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
    await this.mongoConnection.withTransaction(async () => {
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
      await this.userModel.updateOneById(basicProfile._id, {
        $set: { haveProfile: true },
      });
    });
    await this.basicProfileModel.deleteOne(basicProfile._id).catch((error) => {
      this.logger.error(
        `Failed to remove basic profile ${basicProfile._id.toString()} with error ${JSON.stringify(
          error,
        )}`,
      );
    });
  }

  public async uploadPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    client: ClientData,
  ) {
    const { _currentUserId } = this.getClient(client);
    // eslint-disable-next-line prefer-const
    let { profile, basicProfile } = await this.tryFindProfileAndBasicProfile(
      _currentUserId,
    );
    if (profile) {
      this.profileModel.verifyCanUploadFiles(profile);
    }
    return await this.mongoConnection.withTransaction(async () => {
      const mediaFile = await this.filesService.createPhoto(
        file,
        _currentUserId,
      );
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
          if (profile) {
            await this.filesService.updateProfileAfterCreatePhoto(
              mediaFile,
              _currentUserId,
            );
          }
          await this.filesService.removeMediaFileAndCatch(mediaFile);
          throw new NotFoundException(ERROR_MESSAGES['Profile does not exist']);
        }
      }
      return mediaFile;
    });
  }

  async findOneOrFailById(id: string, _client: ClientData) {
    const _id = this.getObjectId(id);
    const findResult = await this.profileModel.findOneOrFailById(_id);
    return findResult;
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
