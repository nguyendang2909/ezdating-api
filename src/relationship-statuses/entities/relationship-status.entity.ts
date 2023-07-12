import { Column, Entity } from 'typeorm';

import { DataEntity } from '../../commons/entities/base.entity';

@Entity({ name: 'relationship_status' })
export class RelationshipStatus extends DataEntity {
  @Column({ name: 'value', type: 'varchar', nullable: false })
  value: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;
}