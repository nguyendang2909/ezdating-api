import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ObjectSchema } from 'joi';

@Injectable()
export class WsValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  private readonly logger = new Logger(WsValidationPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      this.logger.error(`Socket validation failed ${error}`);
      throw new WsException('Validation failed');
    }
    return value;
  }
}
