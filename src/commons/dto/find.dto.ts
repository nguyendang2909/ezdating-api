import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ stripUnknown: true })
export class FindDto {
  @ApiProperty({ type: [String] })
  @JoiSchema(Joi.array().required().min(1).items(Joi.string()))
  f: string[];
}
