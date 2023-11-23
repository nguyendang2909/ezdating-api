import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MeService } from './me.service';

@Controller('/me')
@ApiTags('/me')
@ApiBearerAuth('JWT')
export class MeController {
  constructor(private readonly service: MeService) {}

  // @Post('/deactivate')
  // async deactivate(@Client() clientData: ClientData) {
  //   return {
  //     type: 'deactivate',
  //     data: await this.service.deactivate(clientData),
  //   };
  // }
}
