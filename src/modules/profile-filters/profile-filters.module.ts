import { Module } from '@nestjs/common';
import { ProfileFiltersService } from './profile-filters.service';
import { ProfileFiltersController } from './profile-filters.controller';

@Module({
  controllers: [ProfileFiltersController],
  providers: [ProfileFiltersService]
})
export class ProfileFiltersModule {}
