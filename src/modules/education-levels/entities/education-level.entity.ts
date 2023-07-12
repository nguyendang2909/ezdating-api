import { Column, Entity } from 'typeorm';

import { DataEntity } from '../../../commons/entities/base.entity';

@Entity({ name: 'education_level' })
export class EducationLevel extends DataEntity {
  @Column({ name: 'value', type: 'varchar', nullable: false })
  value: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;
}
