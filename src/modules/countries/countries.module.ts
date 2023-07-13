import { Module } from '@nestjs/common';

import { EntitiesModule } from '../entities/entities.module';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [EntitiesModule],
  exports: [],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
