import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SendViewDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
