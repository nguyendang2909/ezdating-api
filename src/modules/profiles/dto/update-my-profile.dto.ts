import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  EDUCATION_LEVELS,
  GENDERS,
  RELATIONSHIP_GOALS,
  RELATIONSHIP_STATUSES,
} from '../../../constants';
import { REGEXS } from '../../../constants/common.constants';
import {
  EducationLevel,
  Gender,
  RelationshipGoal,
  RelationshipStatus,
} from '../../../types';

export class UpdateMyProfileDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Matches(REGEXS.BIRTHDAY)
  birthday?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ type: Number, enum: EDUCATION_LEVELS })
  @IsOptional()
  @IsEnum(EDUCATION_LEVELS)
  educationLevel?: EducationLevel;

  @ApiPropertyOptional({ type: Number, enum: GENDERS })
  @IsOptional()
  @IsEnum(GENDERS)
  filterGender?: Gender;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  filterMaxDistance?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  filterMinAge?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Min(18)
  @Max(100)
  filterMaxAge?: number;

  @ApiPropertyOptional({ type: Number, enum: GENDERS })
  @IsOptional()
  @IsEnum(GENDERS)
  gender?: Gender;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  height?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  hideAge?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  hideDistance?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  introduce?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  jobTitle?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nickname?: string;

  @ApiPropertyOptional({ type: Number, enum: RELATIONSHIP_GOALS })
  @IsOptional()
  @IsEnum(RELATIONSHIP_GOALS)
  relationshipGoal?: RelationshipGoal;

  // @ApiPropertyOptional({ type: String })
  // @JoiSchema(Joi.string().guid().optional())
  // avatarFileId?: string;

  @ApiPropertyOptional({ type: Number, enum: RELATIONSHIP_STATUSES })
  @IsOptional()
  @IsEnum(RELATIONSHIP_STATUSES)
  relationshipStatus: RelationshipStatus;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  school?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  weight: number;

  // @ApiPropertyOptional({ type: Number })
  // @JoiSchema(Joi.number().optional())
  // stateId?: number;
}
