import { Module } from '@nestjs/common';

import { ProfilesController } from './profiles.controller';
import { BasicProfileWriteService } from './services/basic-profile-write.service';
import { NearbyProfilesServiceFake } from './services/fakes/nearby-profiles.service.fake';
import { NearbyProfilesService } from './services/nearby-profiles.service';
import { ProfilesReadService } from './services/profiles-read.service';
import { ProfilesReadMeService } from './services/profiles-read-me.service';
import { ProfilesWriteMeService } from './services/profiles-write-me.service';
import { SwipeProfilesService } from './services/swipe-profiles.service';

@Module({
  imports: [],
  controllers: [ProfilesController],
  providers: [
    BasicProfileWriteService,
    NearbyProfilesService,
    ProfilesReadMeService,
    ProfilesReadService,
    ProfilesWriteMeService,
    ProfilesReadService,
    SwipeProfilesService,
    NearbyProfilesServiceFake,
  ],
  exports: [],
})
export class ProfilesModule {}
