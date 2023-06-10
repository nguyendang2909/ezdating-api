import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOneDto {
  @IsNotEmpty()
  @IsString()
  updatedBy: string;
}
