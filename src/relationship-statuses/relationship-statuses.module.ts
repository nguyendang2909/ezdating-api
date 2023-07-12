import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RelationshipStatus } from './entities/relationship-status.entity';
import { UserRelationshipStatusEntity } from './relationship-status-entity.service';
import { UserRelationshipStatusesController } from './relationship-statuses.controller';
import { UserRelationshipStatusesService } from './relationship-statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipStatus])],
  exports: [UserRelationshipStatusEntity],
  controllers: [UserRelationshipStatusesController],
  providers: [UserRelationshipStatusesService, UserRelationshipStatusEntity],
})
export class UserRelationshipStatusesModule {}
