import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { MoreThan, Repository } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../users/users-entity.service';
import { contactStatusRules, EContactStatus } from './contacts.constant';
import { ICanSetContactStatus } from './contacts.type';
import { RequestFriendDto } from './dto/create-contact.dto';
import { FindManyContactsDto } from './dto/find-many-contacts.dto';
import { FindOneContactByIdDto } from './dto/find-one-contact-by-id.dto';
import { UpdateContactStatusDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly userEntity: UserEntity,
  ) {}

  public async requestFriend(
    requestFriendDto: RequestFriendDto,
    currentUserId: string,
  ): Promise<{ success: boolean }> {
    const { targetUserId } = requestFriendDto;
    await this.userEntity.findOneOrFailById(targetUserId, { f: ['id'] });
    const currentUser = new User({ id: currentUserId });
    const targetUser = new User({ id: targetUserId });
    const existContact = await this.contactRepository.findOne({
      where: [
        {
          userOne: currentUser,
          userTwo: targetUser,
        },
        {
          userOne: targetUser,
          userTwo: currentUser,
        },
      ],
      relations: ['userOne', 'userTwo', 'requester'],
      select: {
        id: true,
        status: true,
        userOne: { id: true },
        userTwo: { id: true },
        requester: { id: true },
      },
    });
    const now = moment().toDate();
    if (!existContact) {
      const contact = new Contact({
        userOne: currentUser,
        userTwo: targetUser,
        status: EContactStatus.pending,
        statusAt: now,
        requester: currentUser,
        createdBy: currentUserId,
        updatedBy: currentUserId,
      });
      await this.contactRepository.save(contact);

      return { success: true };
    }
    const { id: existContactId, status: existContactStatus } = existContact;
    const requesterId = existContact.requester?.id;
    if (!existContactId || !requesterId || !existContactStatus) {
      throw new BadRequestException();
    }
    const isRequesterMe = currentUserId === requesterId;
    if (!isRequesterMe && existContactStatus === EContactStatus.pending) {
      await this.contactRepository.update(
        { id: existContactId },
        {
          status: EContactStatus.accepted,
          statusAt: now,
          requester: currentUser,
        },
      );
      return { success: true };
    }
    this.checkCanSetStatus({
      status: EContactStatus.pending,
      currentStatus: existContactStatus,
      isRequesterMe,
    });
    await this.contactRepository.update(
      { id: existContactId },
      {
        status: EContactStatus.pending,
        statusAt: now,
        requester: currentUser,
      },
    );
    return { success: true };
  }

  public async findMany(
    findManyContactsDto: FindManyContactsDto,
    currentUserId: string,
  ) {
    const { status, cursor, f } = findManyContactsDto;
    const currentUser = new User({ id: currentUserId });
    const findResult = await this.contactRepository.find({
      where: [
        {
          userOne: currentUser,
          status,
          ...(cursor ? { id: MoreThan(cursor) } : {}),
        },
        {
          userTwo: currentUser,
          status,
          ...(cursor ? { id: MoreThan(cursor) } : {}),
        },
      ],
      order: {
        updatedAt: -1,
      },
      take: 50,
      select: EntityFactory.getSelectFieldsAsObj(f),
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult),
      },
    };
  }

  public async findOneById(
    id: string,
    findOneContactByIdDto: FindOneContactByIdDto,
    currentUserId: string,
  ) {
    const { f } = findOneContactByIdDto;
    return await this.contactRepository.findOne({
      where: [
        {
          id,
          userOne: {
            id: currentUserId,
          },
        },
        {
          id,
          userTwo: {
            id: currentUserId,
          },
        },
      ],
      relations: ['userOne', 'userTwo'],
      // select: EntityFactory.getSelectFieldsAsObj(f),
    });
  }

  public async findOneOrFailById(
    id: string,
    findOneContactByIdDto: FindOneContactByIdDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOneById(
      id,
      findOneContactByIdDto,
      currentUserId,
    );
    if (!findResult) {
      throw new BadRequestException('Contact not found!');
    }
    return findResult;
  }

  public async updateStatus(
    id: string,
    updateContactStatusDto: UpdateContactStatusDto,
    currentUserId: string,
  ) {
    const { status } = updateContactStatusDto;
    const currentUser = new User({ id: currentUserId });
    const existContact = await this.contactRepository.findOne({
      where: [
        {
          id,
          userOne: currentUser,
        },
        {
          id,
          userTwo: currentUser,
        },
      ],
      relations: ['userOne', 'userTwo', 'requester'],
      select: {
        id: true,
        status: true,
        userOne: { id: true },
        userTwo: { id: true },
        requester: { id: true },
      },
    });
    if (!existContact) {
      throw new BadRequestException();
    }
    const {
      id: existContactId,
      status: existContactStatus,
      userOne,
      userTwo,
    } = existContact;
    const requesterId = existContact.requester?.id;
    if (
      !existContactId ||
      !existContactStatus ||
      !userOne ||
      !userTwo ||
      !requesterId
    ) {
      throw new BadRequestException();
    }
    const isRequesterMe = currentUserId === requesterId;
    this.checkCanSetStatus({
      status,
      currentStatus: existContactStatus,
      isRequesterMe,
    });
    await this.contactRepository.update(
      { id },
      {
        status,
        statusAt: moment().toDate(),
        requester: currentUser,
      },
    );

    return { success: true };
  }

  private canSetStatus({
    status,
    currentStatus,
    isRequesterMe,
  }: ICanSetContactStatus): boolean {
    return contactStatusRules[isRequesterMe ? 'me' : 'other'][
      currentStatus
    ].includes(status);
  }

  private checkCanSetStatus(data: ICanSetContactStatus) {
    if (!this.canSetStatus(data)) {
      throw new BadRequestException();
    }
  }

  // canUpdateStatus(
  //   status,
  //   {
  //     myContactStatus,
  //     otherContactStatus,
  //   }: { myContactStatus: EContactStatus; otherContactStatus: EContactStatus },
  // ) {
  //   if (contactStatusRules[myContactStatus][otherContactStatus]) {
  //   }
  // }
}
