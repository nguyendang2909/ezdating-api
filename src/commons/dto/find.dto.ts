import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ stripUnknown: true })
export class FindDto {
  @ApiProperty({ type: [String] })
  @JoiSchema(Joi.object().required())
  f: Record<string, any>;
}
