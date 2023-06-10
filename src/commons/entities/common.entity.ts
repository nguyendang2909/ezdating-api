import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity()
export class CommonEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  createdBy!: string;

  @Column({ type: 'uuid', nullable: false })
  updatedBy!: string;
}
