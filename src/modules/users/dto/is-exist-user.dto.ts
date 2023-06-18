import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindDto } from '../../../commons/dto/find.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindOneUserDto extends FindDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional())
  phoneNumber?: string;
}
