import { Column } from 'typeorm';

import { BaseEntity } from './base.entity';

export class CommonEntity extends BaseEntity {
  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy!: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;
}
