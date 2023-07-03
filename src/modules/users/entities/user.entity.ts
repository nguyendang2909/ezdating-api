import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from '../../../commons/entities/base.entity';
import { EntityFactory } from '../../../commons/lib/entity-factory';
import { Country } from '../../countries/entities/country.entity';
import { State } from '../../states/entities/state.entity';
import { UploadFile } from '../../upload-files/entities/upload-file.entity';
import {
  UserGender,
  UserGenders,
  UserLookingFor,
  UserLookingFors,
  UserRole,
  UserRoles,
  UserStatus,
  UserStatuses,
} from '../users.constant';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ name: 'birthday', nullable: true, type: 'timestamp' })
  birthday?: Date | string;

  @ManyToOne(() => State, { nullable: true })
  @JoinColumn({ name: 'state_id' })
  state?: State;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  countryId?: string;

  @Column({ name: 'email', length: 100, nullable: true, type: 'varchar' })
  email?: string;

  @Column({ name: 'gender', enum: UserGenders, nullable: true, type: 'enum' })
  gender?: UserGender;

  @Column({ name: 'introduce', type: 'varchar', nullable: true, length: 500 })
  introduce?: string;

  @Index({ spatial: true })
  @Column({
    name: 'location',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: string;

  @Column({
    name: 'looking_for',
    type: 'enum',
    enum: UserLookingFors,
    nullable: true,
  })
  lookingFor?: UserLookingFor;

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

  @OneToMany(() => UploadFile, (file) => file.user)
  uploadFiles: UploadFile[];

  @Column({
    name: 'role',
    default: UserRoles.member,
    enum: UserRoles,
    nullable: false,
    type: 'enum',
  })
  role!: UserRole;

  @Column({
    name: 'status',
    default: UserStatuses.activated,
    enum: UserStatuses,
    nullable: false,
    type: 'enum',
  })
  status!: UserStatus;

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
