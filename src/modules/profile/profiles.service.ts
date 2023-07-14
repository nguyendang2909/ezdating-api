import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { UserStatuses } from '../../commons/constants/enums';
import { User } from '../entities/entities/user.entity';
import { StateModel } from '../entities/state.model';
import { UploadFileModel } from '../entities/upload-file.model';
import { UserModel } from '../entities/users.model';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userModel: UserModel,
    private readonly uploadFileModel: UploadFileModel,
    private readonly stateModel: StateModel, // private readonly countryModel: CountryModel,
  ) {}

  public async getProfile(currentUserId: string) {
    // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...userPart } = await this.userModel.findOneOrFail({
      where: {
        id: currentUserId,
      },
      relations: {
        uploadFiles: true,
        avatarFile: true,
      },
    });

    const formattedProfile = {
      ...userPart,
      avatar: userPart.avatarFile?.location,
    };

    return formattedProfile;
  }

  public async updateProfile(
    payload: UpdateMyProfileDto,
    currentUserId: string,
  ) {
    const { avatarFileId, longitude, latitude, stateId, ...updateDto } =
      payload;

    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      ...(longitude && latitude
        ? {
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          }
        : {}),
    };

    if (avatarFileId) {
      await this.uploadFileModel.findOneOrFail({
        where: {
          id: avatarFileId,
          user: {
            id: currentUserId,
          },
        },
      });
      updateOptions.avatarFile = { id: avatarFileId };
    }

    if (stateId) {
      await this.stateModel.findOneOrFail({
        where: { id: stateId },
      });
      updateOptions.state = {
        id: stateId,
      };
    }

    return await this.userModel.updateOneById(
      currentUserId,
      updateOptions,
      currentUserId,
    );
  }

  public async updateProfileBasicInfo(
    payload: UpdateMyProfileBasicInfoDto,
    currentUserId: string,
  ) {
    const { stateId, ...updateDto } = payload;
    await this.stateModel.findOneOrFail({
      where: { id: stateId },
    });
    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      state: { id: stateId },
      haveBasicInfo: true,
    };
    return await this.userModel.updateOneById(
      currentUserId,
      updateOptions,
      currentUserId,
    );
  }

  public async deactivate(userId: string) {
    return await this.userModel.updateOneById(
      userId,
      {
        status: UserStatuses.activated,
      },
      userId,
    );
  }
}
