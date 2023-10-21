import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMatchDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  spendCoin?: true;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
