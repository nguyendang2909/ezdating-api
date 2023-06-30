import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';
import {
  RelationshipUserStatus,
  RelationshipUserStatuses,
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
    type: 'enum',
    enum: RelationshipUserStatuses,
  })
  userOneStatus?: RelationshipUserStatus;

  @Column({
    name: 'user_one_status',
    nullable: true,
    type: 'enum',
    enum: RelationshipUserStatuses,
  })
  userTwoStatus?: RelationshipUserStatus;

  @Column({ name: 'status_at', type: 'date', nullable: true })
  statusAt: Date;

  @Column({ name: 'user_one_status_at', type: 'date', nullable: true })
  userOneStatusAt: Date;

  @Column({ name: 'user_two_status_at', type: 'date', nullable: true })
  userTwoStatusAt: Date;

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

  @Column({
    name: 'last_message',
    nullable: true,
    type: 'text',
  })
  lastMessage?: string;

  @Column({
    name: 'last_message_at',
    nullable: true,
    type: 'datetime',
  })
  lastMessageAt?: string;
}
