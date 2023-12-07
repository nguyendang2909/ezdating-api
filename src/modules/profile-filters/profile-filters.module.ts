import { Module } from '@nestjs/common';

import { ProfileFiltersController } from './profile-filters.controller';
import { ProfileFiltersService } from './profile-filters.service';

@Module({
  controllers: [ProfileFiltersController],
  providers: [ProfileFiltersService],
})
export class ProfileFiltersModule {}
