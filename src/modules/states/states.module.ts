import { Module } from '@nestjs/common';

import { EntitiesModule } from '../entities/entities.module';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';

@Module({
  imports: [EntitiesModule],
  exports: [],
  controllers: [StatesController],
  providers: [StatesService],
})
export class StatesModule {}
