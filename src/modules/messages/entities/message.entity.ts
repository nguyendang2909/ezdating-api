import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';

@Entity()
export class Message extends CommonEntity {
  @OneToOne(() => Message, { nullable: true })
  @JoinColumn()
  replyMessage?: Message;

  @Column({ nullable: false, type: 'uuid' })
  userId!: string;

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
