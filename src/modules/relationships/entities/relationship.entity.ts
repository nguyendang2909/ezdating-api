import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';

export class Relationship extends CommonEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_two' })
  userOne!: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_two' })
  userTwo!: User;

  @Column({
    name: 'like_one',
    nullable: false,
    type: 'varchar',
    default: false,
  })
  likeOne?: boolean;

  @Column({
    name: 'like_two',
    nullable: false,
    type: 'boolean',
    default: false,
  })
  likeTwo?: boolean;
}
