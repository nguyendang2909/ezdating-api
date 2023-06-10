import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../commons/entities/base.entity';
import { EntityFactory } from '../../../commons/lib/entity-factory';
import { EGender, ERole, EUserStatus } from '../users.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true, type: 'timestamp' })
  birthDate?: Date | string;

  @Column({ length: 100, nullable: true, type: 'varchar' })
  email?: string;

  @Column({ length: 100, nullable: true, type: 'varchar' })
  firstName?: string;

  @Column({ enum: EGender, nullable: true, type: 'enum' })
  gender?: string;

  @Column({ length: 100, nullable: true, type: 'varchar' })
  lastName?: string;

  @Column({ length: 300, nullable: true, type: 'varchar' })
  password?: string;

  @Column({
    length: 20,
    nullable: false,
    type: 'varchar',
  })
  phoneNumber!: string;

  @Column({
    default: ERole.member,
    enum: ERole,
    nullable: false,
    type: 'enum',
  })
  role!: ERole;

  @Column({
    default: EUserStatus.activated,
    enum: EUserStatus,
    nullable: false,
    type: 'enum',
  })
  status!: EUserStatus;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  constructor(obj: Partial<User>) {
    super();

    Object.assign(this, obj);
  }
}

export const userEntityName = EntityFactory.getEntityName(User);
