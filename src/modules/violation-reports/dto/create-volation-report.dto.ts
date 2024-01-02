import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVolationReportDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  targetUserId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reason: string;
}
