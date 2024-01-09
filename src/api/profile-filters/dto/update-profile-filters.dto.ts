import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

import { ERROR_MESSAGES } from '../../../commons/messages';
import { GENDERS, RELATIONSHIP_GOALS } from '../../../constants';
import { Gender, RelationshipGoal } from '../../../types';
import { IsBiggerOrEqual } from '../../../utils';

export class UpdateProfileFilterDto {
  @ApiPropertyOptional({ type: Number, enum: GENDERS })
  @IsOptional()
  @IsEnum(GENDERS)
  gender?: Gender;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxDistance?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  minAge?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Min(18)
  @Max(100)
  @IsBiggerOrEqual('minAge', {
    message: ERROR_MESSAGES['Max age must be larger than min age'],
  })
  maxAge?: number;

  @ApiPropertyOptional({ type: Number, enum: RELATIONSHIP_GOALS })
  @IsOptional()
  @IsEnum(RELATIONSHIP_GOALS)
  relationshipGoal?: RelationshipGoal;
}
