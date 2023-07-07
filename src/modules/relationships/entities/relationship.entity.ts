import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import {
  RelationshipUserStatus,
  RelationshipUserStatuses,
} from '../relationships.constant';

@Entity({ name: 'relationship' })
export class Relationship {
  @PrimaryColumn('varchar')
  id!: string;

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
    name: 'user_two_status',
    nullable: true,
    type: 'enum',
    enum: RelationshipUserStatuses,
  })
  userTwoStatus?: RelationshipUserStatus;

  @Column({ name: 'status_at', type: 'timestamp', nullable: true })
  statusAt?: Date;

  @Column({ name: 'user_one_status_at', type: 'timestamp', nullable: true })
  userOneStatusAt: Date;

  @Column({ name: 'user_two_status_at', type: 'timestamp', nullable: true })
  userTwoStatusAt: Date;

  @Column({
    name: 'can_user_one_chat',
    nullable: true,
    type: 'boolean',
  })
  canUserOneChat?: boolean;

  @Column({
    name: 'can_user_two_chat',
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
    type: 'timestamp',
  })
  lastMessageAt?: Date;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy!: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;
}
