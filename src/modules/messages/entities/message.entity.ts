import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { Relationship } from '../../relationships/entities/relationship.entity';

@Entity()
export class Message extends CommonEntity {
  @Column({ name: 'audio', type: 'varchar', nullable: true })
  audio?: string;

  @OneToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'reply_message' })
  replyMessage?: Message;

  @ManyToOne(() => Relationship, { nullable: false })
  @JoinColumn({ name: 'relationship_id' })
  relationship: Partial<Relationship>;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ array: true, type: 'uuid', nullable: true })
  likeUserIds?: string[];

  @Column({ array: true, type: 'uuid', nullable: true })
  loveUserIds?: string[];

  @Column({ type: 'varchar', nullable: true })
  text?: string;

  @Column({ type: 'varchar', nullable: true })
  video?: string;

  @Column({ type: 'uuid', nullable: false })
  uuid!: string;
}
