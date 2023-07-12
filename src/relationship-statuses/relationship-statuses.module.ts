import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RelationshipStatus } from './entities/relationship-status.entity';
import { RelationshipStatusEntity } from './relationship-status-entity.service';
import { RelationshipStatusesController } from './relationship-statuses.controller';
import { RelationshipStatusesService } from './relationship-statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipStatus])],
  exports: [RelationshipStatusEntity],
  controllers: [RelationshipStatusesController],
  providers: [RelationshipStatusesService, RelationshipStatusEntity],
})
export class RelationshipStatusesModule {}
