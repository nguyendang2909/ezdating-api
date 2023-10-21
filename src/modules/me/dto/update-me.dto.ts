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
  REGEXS,
  UserEducationLevel,
  UserEducationLevels,
  UserGender,
  UserGenders,
  UserRelationshipGoal,
  UserRelationshipGoals,
  UserRelationshipStatus,
  UserRelationshipStatuses,
} from '../../../commons/constants';

export class UpdateMeDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Matches(REGEXS.BIRTHDAY)
  birthday?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ type: Number, enum: UserEducationLevels })
  @IsOptional()
  @IsEnum(UserEducationLevels)
  educationLevel?: UserEducationLevel;

  @ApiPropertyOptional({ type: Number, enum: UserGenders })
  @IsOptional()
  @IsEnum(UserGenders)
  filterGender?: UserGender;

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

  @ApiPropertyOptional({ type: Number, enum: UserGenders })
  @IsOptional()
  @IsEnum(UserGenders)
  gender?: UserGender;

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

  @ApiPropertyOptional({ type: Number, enum: UserRelationshipGoals })
  @IsOptional()
  @IsEnum(UserRelationshipGoals)
  relationshipGoal?: UserRelationshipGoal;

  // @ApiPropertyOptional({ type: String })
  // @JoiSchema(Joi.string().guid().optional())
  // avatarFileId?: string;

  @ApiPropertyOptional({ type: Number, enum: UserRelationshipStatuses })
  @IsOptional()
  @IsEnum(UserRelationshipStatuses)
  relationshipStatus: UserRelationshipStatus;

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
