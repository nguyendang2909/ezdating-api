import { Module } from '@nestjs/common';

import { LikesModule } from '../likes/likes.module';
import { NearbyProfilesService } from './nearby-profiles.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesScript } from './profiles.scrip';
import { ProfilesService } from './profiles.service';
import { SwipeProfilesService } from './swipe-profiles.service';

@Module({
  imports: [LikesModule],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    NearbyProfilesService,
    SwipeProfilesService,
    ProfilesScript,
  ],
})
export class ProfilesModule {}
