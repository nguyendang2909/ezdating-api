import { Column, Entity } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';

@Entity()
export class Room extends CommonEntity {
  @Column({ name: 'last_message', nullable: true, type: 'varchar' })
  latMessage: string;

  @Column({ name: 'last_message_at', nullable: true, type: 'date' })
  lastMessageAt: Date;

  @Column({ name: 'name', nullable: true, type: 'varchar' })
  name?: string;

  @Column({ name: 'user_ids', array: true, nullable: false, type: 'uuid' })
  userIds?: string[];

  constructor(obj: Partial<Room>) {
    super();
    Object.assign(this, obj);
  }
}
