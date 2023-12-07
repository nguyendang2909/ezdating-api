import { Module } from '@nestjs/common';

import { LikesModule } from '../likes/likes.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ApiScript } from './api.script';
import { ProfilesScript } from './profiles.script';

@Module({
  imports: [LikesModule, ProfilesModule],
  providers: [ProfilesScript, ApiScript],
})
export class ScriptsModule {}
