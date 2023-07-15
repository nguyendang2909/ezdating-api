import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  UploadFileType,
  UploadFileTypes,
} from '../../../commons/constants/enums';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { User } from './user.entity';

@Entity({ name: 'upload_file' })
export class UploadFile extends BaseEntity {
  @Column({ name: 'key', type: 'varchar', nullable: false })
  key?: string;

  @Column({ name: 'location', type: 'varchar', nullable: false })
  location?: string;

  @ManyToOne(() => User, (user) => user.uploadFiles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({
    name: 'type',
    type: 'enum',
    nullable: false,
    enum: UploadFileTypes,
  })
  type?: UploadFileType;
}
