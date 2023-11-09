import { Module } from '@nestjs/common';

import { LikesModule } from '../likes/likes.module';
import { ProfilesScript } from './profiles.script';

@Module({
  imports: [LikesModule],
  providers: [ProfilesScript],
})
export class ScriptsModule {}
