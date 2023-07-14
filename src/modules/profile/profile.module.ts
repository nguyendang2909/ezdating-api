import { Module } from '@nestjs/common';

import { EntitiesModule } from '../entities/entities.module';
import { ProfilesController } from './profiles.controller';
import { ProfileService } from './profiles.service';

@Module({
  imports: [EntitiesModule],
  exports: [],
  controllers: [ProfilesController],
  providers: [ProfileService],
})
export class ProfileModule {}
