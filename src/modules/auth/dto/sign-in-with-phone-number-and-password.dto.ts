import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ stripUnknown: true })
export class SignInWithPhoneNumberAndPasswordDto {
  @ApiProperty({ type: String, default: '+84971016191' })
  @JoiSchema(Joi.string().required())
  phoneNumber!: string;

  @ApiProperty({ type: String, default: 'Onlyone2@' })
  @JoiSchema(Joi.string().required().min(8).max(100))
  password!: string;
}
