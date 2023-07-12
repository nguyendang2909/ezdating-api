import { PartialType } from '@nestjs/swagger';
import { CreateUserRelationshipStatusDto } from './create-user-relationship-status.dto';

export class UpdateUserRelationshipStatusDto extends PartialType(CreateUserRelationshipStatusDto) {}
