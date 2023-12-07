import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindManyCursorQuery {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  _next?: string;

  // @ApiPropertyOptional({ type: String })
  // @JoiSchema(Joi.string().optional().allow(null))
  // _prev?: string;
}
