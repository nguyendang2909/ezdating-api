import { IsNotEmpty, IsString } from 'class-validator';

import { SignInDto } from './sign-in.dto';

export class SignInWithAppleDto extends SignInDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
