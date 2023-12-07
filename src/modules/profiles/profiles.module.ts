import { Module } from '@nestjs/common';

import { NearbyProfilesService } from './nearby-profiles.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SwipeProfilesService } from './swipe-profiles.service';

@Module({
  imports: [],
  controllers: [ProfilesController],
  providers: [ProfilesService, NearbyProfilesService, SwipeProfilesService],
  exports: [],
})
export class ProfilesModule {}
