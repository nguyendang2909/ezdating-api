import { Module } from '@nestjs/common';

import { NearbyProfilesService } from './nearby-profiles.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesScript } from './profiles.scrip';
import { ProfilesService } from './profiles.service';
import { SwipeProfilesService } from './swipe-profiles.service';

@Module({
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    NearbyProfilesService,
    SwipeProfilesService,
    ProfilesScript,
  ],
})
export class ProfilesModule {}
