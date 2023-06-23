import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';
import {
  RelationshipUserStatus,
  RelationshipUserStatusObj,
} from '../relationships.constant';

export class Relationship extends CommonEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_one' })
  userOne!: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_two' })
  userTwo!: User;

  @Column({
    name: 'user_one_status',
    nullable: true,
    type: 'varchar',
    enum: RelationshipUserStatusObj,
  })
  userOneStatus?: RelationshipUserStatus;

  @Column({
    name: 'user_one_status',
    nullable: true,
    type: 'varchar',
    enum: RelationshipUserStatusObj,
  })
  userTwoStatus?: RelationshipUserStatus;

  @Column({ name: 'status_at', type: 'date', nullable: true })
  statusAt: Date;

  @Column({
    name: 'can_user_chat',
    nullable: true,
    type: 'boolean',
  })
  canUserOneChat?: boolean;

  @Column({
    name: 'can_user_chat',
    nullable: true,
    type: 'boolean',
  })
  canUserTwoChat?: boolean;
}
