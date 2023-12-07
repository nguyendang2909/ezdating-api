import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SendLikeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
