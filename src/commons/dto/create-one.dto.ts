import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateOneDto } from './update-one.dto';

export class CreateOneDto extends UpdateOneDto {
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
