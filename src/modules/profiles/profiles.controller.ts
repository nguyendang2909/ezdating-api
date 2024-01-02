import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { APP_CONFIG } from '../../app.config';
import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RequireRoles } from '../../commons/decorators/require-roles.decorator';
import { ERROR_MESSAGES } from '../../commons/messages';
import { RESPONSE_TYPES, USER_ROLES } from '../../constants';
import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { UploadPhotoDtoDto } from '../media-files/dto/upload-photo.dto';
import { Profile } from '../models';
import {
  CreateBasicProfileDto,
  FindManyNearbyProfilesQuery,
  FindManySwipeProfilesQuery,
  UpdateMyProfileDto,
} from './dto';
import { BasicProfileWriteService } from './services/basic-profile-write.service';
import { NearbyProfilesServiceFake } from './services/fakes/nearby-profiles.service.fake';
import { ProfilesReadService } from './services/profiles-read.service';
import { ProfilesReadMeService } from './services/profiles-read-me.service';
import { ProfilesWriteMeService } from './services/profiles-write-me.service';
import { SwipeProfilesService } from './services/swipe-profiles.service';

@Controller('/profiles')
@ApiTags('/profiles')
@ApiBearerAuth('JWT')
export class ProfilesController {
  constructor(
    private readonly readMeService: ProfilesReadMeService,
    private readonly basicProfileWriteService: BasicProfileWriteService,
    private readonly writeMeService: ProfilesWriteMeService,
    private readonly swipeProfilesService: SwipeProfilesService,
    private readonly nearbyProfilesService: NearbyProfilesServiceFake,
    private readonly profilesReadService: ProfilesReadService,
  ) {}

  // * Me api
  @Post('/me/basic')
  async createBasicProfile(
    @Body() payload: CreateBasicProfileDto,
    @Client() client: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.CREATE_BASIC_PROFILE,
      data: await this.basicProfileWriteService.createOne(payload, client),
    };
  }

  @Post('/me/basic-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: APP_CONFIG.UPLOAD_PHOTO_MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          req.fileValidationError = 'goes wrong on the mimetype';
          return cb(
            new BadRequestException({
              errorCode: 'PHOTO_TYPE_INCORRECT',
              message: 'Photo type incorrect!',
            }),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadBasicPhoto(
    @Client() clientData: ClientData,
    @Body() payload: UploadPhotoDtoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['File does not exist'],
      });
    }
    return {
      type: RESPONSE_TYPES.UPLOAD_PHOTO,
      data: await this.basicProfileWriteService.uploadPhoto(
        file,
        payload,
        clientData,
      ),
    };
  }

  @Get('/me')
  async getProfile(@Client() clientData: ClientData) {
    return {
      type: RESPONSE_TYPES.PROFILE,
      data: await this.readMeService.findOne(clientData),
    };
  }

  @Patch('/me')
  private async updateMe(
    @Body() payload: UpdateMyProfileDto,
    @Client() clientData: ClientData,
  ): Promise<void> {
    await this.writeMeService.updateOne(payload, clientData);
  }
  // * End me api

  @Get('/swipe')
  public async findManySwipe(
    @Query() queryParams: FindManySwipeProfilesQuery,
    @Client() clientData: ClientData,
  ): Promise<PaginatedResponse<Profile>> {
    const profiles = await this.swipeProfilesService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.SWIPE_PROFILES,
      data: profiles,
      pagination: { _next: null },
    };
  }

  @Get('/nearby')
  public async findManyNearby(
    @Query() queryParams: FindManyNearbyProfilesQuery,
    @Client() clientData: ClientData,
  ) {
    const findResults = await this.nearbyProfilesService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.NEARBY_PROFILES,
      data: findResults,
      pagination: this.nearbyProfilesService.getPagination(findResults),
    };
  }

  @Get('/test')
  @RequireRoles([USER_ROLES.ADMIN])
  async test() {
    return await this.nearbyProfilesService.test();
  }

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @Client() client: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.PROFILE,
      data: await this.profilesReadService.findOneById(id, client),
    };
  }
}
