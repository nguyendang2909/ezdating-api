import { Module } from '@nestjs/common';

import { EntitiesModule } from '../entities/entities.module';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

@Module({
  imports: [EntitiesModule],
  exports: [],
  controllers: [RelationshipsController],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
