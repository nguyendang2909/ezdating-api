import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { Relationship } from './entities/relationship.entity';
import { RelationshipEntity } from './relationship-entity.service';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship]), UsersModule],
  exports: [RelationshipEntity],
  controllers: [RelationshipsController],
  providers: [RelationshipsService, RelationshipEntity],
})
export class RelationshipsModule {}
