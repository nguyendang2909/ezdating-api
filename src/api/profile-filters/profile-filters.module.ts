import { Module } from '@nestjs/common';

import { ProfileFiltersController } from './profile-filters.controller';
import { ProfileFiltersReadMeService } from './services/profile-filters-read-me.service';
import { ProfileFiltersWriteMeService } from './services/profile-filters-write-me.service';

@Module({
  controllers: [ProfileFiltersController],
  providers: [ProfileFiltersWriteMeService, ProfileFiltersReadMeService],
})
export class ProfileFiltersModule {}
