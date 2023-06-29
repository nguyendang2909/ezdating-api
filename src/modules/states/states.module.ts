import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { State } from './entities/state.entity';
import { StateEntity } from './state-entity.service';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  exports: [StateEntity],
  controllers: [StatesController],
  providers: [StatesService, StateEntity],
})
export class StatesModule {}
