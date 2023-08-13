import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { ProfilesController } from './profiles.controller';
import { ProfileService } from './profiles.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [ProfilesController],
  providers: [ProfileService],
})
export class ProfileModule {}
