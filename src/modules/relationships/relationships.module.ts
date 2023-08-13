import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [RelationshipsController],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
