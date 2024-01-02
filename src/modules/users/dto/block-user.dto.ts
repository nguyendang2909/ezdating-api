import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BlockUserDto {
  @IsNotEmpty()
  @IsMongoId()
  targetUserId: string;
}
