import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ReadMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  lastMessageId: string;

  @IsNotEmpty()
  @IsMongoId()
  matchId: string;
}
