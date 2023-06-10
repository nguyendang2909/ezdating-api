import { Column, Entity } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';

@Entity()
export class Room extends CommonEntity {
  @Column({ nullable: true, type: 'varchar' })
  latMessage: string;

  @Column({ nullable: true, type: 'date' })
  lastMessageAt: Date;

  @Column({ nullable: true, type: 'varchar' })
  name?: string;

  @Column({ array: true, nullable: false, type: 'uuid' })
  userIds?: string[];

  constructor(obj: Partial<Room>) {
    super();
    Object.assign(this, obj);
  }
}
