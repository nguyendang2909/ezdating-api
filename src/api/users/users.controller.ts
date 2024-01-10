import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { ClientData } from '../auth/auth.type';
import { BlockUserDto } from './dto/block-user.dto';
import { UsersReadMeService } from './services';
import { UsersWriteService } from './services/users.write.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(
    private readonly readMeService: UsersReadMeService,
    private readonly usersWriteService: UsersWriteService,
  ) {}

  @Post('/blocks')
  async block(payload: BlockUserDto, @Client() client: ClientData) {
    return {
      type: 'block_user',
      data: await this.usersWriteService.block(payload, client),
    };
  }

  @Post('/unblock')
  async unblock(payload: BlockUserDto, @Client() client: ClientData) {
    return {
      type: 'block_user',
      data: await this.usersWriteService.unblock(payload, client),
    };
  }

  @Get('/me')
  async findMe(@Client() client: ClientData) {
    return {
      type: 'user',
      data: await this.readMeService.findOne(client),
    };
  }

  @Get('/deactivation')
  @IsPublicEndpoint()
  async deactivateInfo() {
    return {
      type: 'user',
      data: 'Go to app to deactivate your account',
    };
  }

  // @Post('/me/deactivate')
  // async deactivate(@Client() clientData: ClientData) {
  //   return {
  //     type: 'deactivate',
  //     data: await this.usersService.deactivate(clientData),
  //   };
  // }
}
