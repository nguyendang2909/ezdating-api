import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class SendViewDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
