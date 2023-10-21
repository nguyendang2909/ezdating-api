import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInWithPhoneNumberAndPasswordDto {
  @ApiProperty({ type: String, default: '+84971016191' })
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty({ type: String, default: 'Onlyone2@' })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
