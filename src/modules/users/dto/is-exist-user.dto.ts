import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { FindDto } from '../../../commons/dto/find.dto';

@JoiSchemaOptions({ stripUnknown: true })
export class FindOneUserDto extends FindDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional())
  phoneNumber?: string;
}
