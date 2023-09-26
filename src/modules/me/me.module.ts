import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
