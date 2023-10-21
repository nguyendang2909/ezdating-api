import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendLikeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  targetUserId: string;
}
