import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateMatchDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  spendCoin?: true;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
