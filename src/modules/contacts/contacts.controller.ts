import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { ContactsService } from './contacts.service';
import { RequestFriendDto } from './dto/create-contact.dto';
import { FindManyContactsDto } from './dto/find-many-contacts.dto';
import { FindOneContactByIdDto } from './dto/find-one-contact-by-id.dto';
import { UpdateContactStatusDto } from './dto/update-contact.dto';

@Controller('contacts')
@ApiTags('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  private async requestFriend(
    @Body() requestFriendDto: RequestFriendDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'requestFriend',
      data: await this.contactsService.requestFriend(
        requestFriendDto,
        currentUserId,
      ),
    };
  }

  @Get()
  private async findMany(
    @Query() findManyContactsDto: FindManyContactsDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'findManyContacts',
      // ...(await this.contactsService.findMany(
      //   findManyContactsDto,
      //   currentUserId,
      // )),
    };
  }

  @Get(':id')
  private async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() findOneContactByIdDto: FindOneContactByIdDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'contact',
      data: await this.contactsService.findOneOrFailById(
        id,
        findOneContactByIdDto,
        currentUserId,
      ),
    };
  }

  @Patch('/:id/status')
  private async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactStatusDto: UpdateContactStatusDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'updateContact',
      data: await this.contactsService.updateStatus(
        id,
        updateContactStatusDto,
        currentUserId,
      ),
    };
  }
}
