import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class AdminLoginDto {
  @ApiPropertyOptional({ type: String })
  @ValidateIf((o) => !o.email || !!o.phoneNumber)
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({ type: String })
  @ValidateIf((o) => !o.phoneNumber || !!o.email)
  @IsString()
  email: string;
}
