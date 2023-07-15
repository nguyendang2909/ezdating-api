import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Point,
} from 'typeorm';

import {
  UserEducationLevel,
  UserEducationLevels,
  UserGender,
  UserGenders,
  UserLookingFor,
  UserLookingFors,
  UserRelationshipStatus,
  UserRelationshipStatuses,
  UserRole,
  UserRoles,
  UserStatus,
  UserStatuses,
} from '../../../commons/constants/constants';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { EntityFactory } from '../../../commons/lib/entity-factory';
import { Country } from './country.entity';
import { State } from './state.entity';
import { UploadFile } from './upload-file.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  avatar?: string;

  @OneToOne(() => UploadFile, (file) => file.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'avatar_file_id' })
  avatarFile?: UploadFile;

  @Column({ name: 'birthday', nullable: true, type: 'date' })
  birthday?: string;

  @Column({ name: 'coins', type: 'integer', nullable: false, default: 0 })
  coins: number;

  @Column({
    name: 'education_level',
    type: 'enum',
    enum: UserEducationLevels,
    nullable: true,
  })
  educationLevel: UserEducationLevel;

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

  @Column({ name: 'height', type: 'integer', nullable: true })
  height?: number;

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
  location?: Point;

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

  @Column({
    name: 'is_verified',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isVerified?: boolean;

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
    nullable: true,
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

  @Column({
    name: 'last_active_at',
    type: 'timestamp',
    default: new Date(),
    nullable: false,
  })
  lastActivatedAt!: Date;

  @Column({
    name: 'relationship_status',
    type: 'enum',
    enum: UserRelationshipStatuses,
    nullable: true,
  })
  relationshipStatus: UserRelationshipStatus;

  @Column({ name: 'weight', type: 'integer', nullable: true })
  weight?: number;

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
