import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { GENDERS, REGEXS, RELATIONSHIP_GOALS } from '../../../constants';
import { Gender, RelationshipGoal } from '../../../types';

export class CreateBasicProfileDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Matches(REGEXS.BIRTHDAY)
  birthday: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsEnum(GENDERS)
  gender: Gender;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  introduce?: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nickname!: string;

  @ApiProperty({ type: Number, enum: RELATIONSHIP_GOALS })
  @IsNotEmpty()
  @IsEnum(RELATIONSHIP_GOALS)
  relationshipGoal!: RelationshipGoal;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  stateId: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
