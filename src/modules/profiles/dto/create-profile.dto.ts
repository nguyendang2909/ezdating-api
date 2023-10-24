import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { GENDERS, REGEXS, RELATIONSHIP_GOALS } from '../../../constants';
import { Gender, RelationshipGoal } from '../../../types';

export class CreateProfileDto {
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

  // @ApiProperty({ type: String })
  // @JoiSchema(Joi.number().required())
  // stateId?: number;
}
