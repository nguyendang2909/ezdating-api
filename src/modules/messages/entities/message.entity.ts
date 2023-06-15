import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';

@Entity()
export class Message extends CommonEntity {
  @OneToOne(() => Message, { nullable: true })
  @JoinColumn()
  replyMessage?: Message;

  @Column({ nullable: false, type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar' })
  imageUrl?: string;

  @Column({ array: true, type: 'uuid' })
  likeUserIds?: string[];

  @Column({ array: true, type: 'uuid' })
  loveUserIds?: string[];

  @Column({ type: 'varchar' })
  text?: string;

  @Column({ type: 'varchar' })
  videoUrl?: string;
}
