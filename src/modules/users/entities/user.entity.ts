import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../commons/entities/base.entity';
import { EntityFactory } from '../../../commons/lib/entity-factory';
import {
  EGender,
  ERole,
  EUserLookingFor,
  EUserStatus,
} from '../users.constant';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'birth_day', nullable: true, type: 'timestamp' })
  birthDay?: Date | string;

  @Column({ name: 'email', length: 100, nullable: true, type: 'varchar' })
  email?: string;

  @Column({ name: 'gender', enum: EGender, nullable: true, type: 'enum' })
  gender?: string;

  @Column({ name: 'introduce', type: 'varchar', nullable: true, length: 500 })
  introduce?: string;

  @Column({
    name: 'looking_for',
    type: 'enum',
    enum: EUserLookingFor,
    nullable: true,
  })
  lookingFor?: EUserLookingFor;

  @Column({
    name: 'have_basic_info',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  haveBasicInfo?: boolean;

  @Column({ name: 'nickname', length: 100, nullable: true, type: 'varchar' })
  nickname?: string;

  @Column({ name: 'password', length: 300, nullable: true, type: 'varchar' })
  password?: string;

  @Column({
    name: 'phone_number',
    length: 20,
    nullable: false,
    type: 'varchar',
  })
  phoneNumber?: string;

  @Column({
    name: 'role',
    default: ERole.member,
    enum: ERole,
    nullable: false,
    type: 'enum',
  })
  role!: ERole;

  @Column({
    name: 'status',
    default: EUserStatus.activated,
    enum: EUserStatus,
    nullable: false,
    type: 'enum',
  })
  status!: EUserStatus;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  constructor(obj: Partial<User>) {
    super();

    Object.assign(this, obj);
  }
}

export const userEntityName = EntityFactory.getEntityName(User);
