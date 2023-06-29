import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatesModule } from '../states/states.module';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { CountryEntity } from './country-entity.service';
import { Country } from './entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), StatesModule],
  exports: [CountryEntity],
  controllers: [CountriesController],
  providers: [CountriesService, CountryEntity],
})
export class CountriesModule {}
