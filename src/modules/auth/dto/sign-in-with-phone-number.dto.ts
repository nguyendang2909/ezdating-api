import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SignInDto } from './sign-in.dto';

export class SignInWithPhoneNumberDto extends SignInDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  token: string;
}
