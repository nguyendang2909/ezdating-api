import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { Relationship } from '../../relationships/entities/relationship.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message extends CommonEntity {
  @OneToOne(() => Message, { nullable: true })
  @JoinColumn()
  replyMessage?: Message;

  @ManyToOne(() => Relationship, { nullable: false })
  relationship: Partial<Relationship>;

  @ManyToOne(() => User, { nullable: false })
  user: Partial<User>;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ array: true, type: 'uuid', nullable: true })
  likeUserIds?: string[];

  @Column({ array: true, type: 'uuid', nullable: true })
  loveUserIds?: string[];

  @Column({ type: 'varchar', nullable: true })
  text?: string;

  @Column({ type: 'varchar', nullable: true })
  videoUrl?: string;

  @Column({ type: 'uuid', nullable: false })
  uuid!: string;
}
