import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
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
  @Matches(REGEXS.BIRTHDAY)
  birthday?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  company?: string;

  @ApiPropertyOptional({ type: Number, enum: UserEducationLevels })
  @IsEnum(UserEducationLevels)
  educationLevel?: UserEducationLevel;

  @ApiPropertyOptional({ type: Number, enum: UserGenders })
  @IsEnum(UserGenders)
  filterGender?: UserGender;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @Min(1)
  @Max(100)
  filterMaxDistance?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @Min(18)
  @Max(100)
  filterMinAge?: number;

  @ApiPropertyOptional({ type: Number })
  @Min(18)
  @Max(100)
  filterMaxAge?: number;

  @ApiPropertyOptional({ type: Number, enum: UserGenders })
  @IsEnum(UserGenders)
  gender?: UserGender;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  height?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  hideAge?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  hideDistance?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @MaxLength(500)
  introduce?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @MaxLength(200)
  jobTitle?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @MaxLength(100)
  nickname?: string;

  @ApiPropertyOptional({ type: Number, enum: UserRelationshipGoals })
  @IsEnum(UserRelationshipGoals)
  relationshipGoal?: UserRelationshipGoal;

  // @ApiPropertyOptional({ type: String })
  // @JoiSchema(Joi.string().guid().optional())
  // avatarFileId?: string;

  @ApiPropertyOptional({ type: Number, enum: UserRelationshipStatuses })
  @IsEnum(UserRelationshipStatuses)
  relationshipStatus: UserRelationshipStatus;

  @ApiPropertyOptional({ type: String })
  @IsString()
  school?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  weight: number;

  // @ApiPropertyOptional({ type: Number })
  // @JoiSchema(Joi.number().optional())
  // stateId?: number;
}
