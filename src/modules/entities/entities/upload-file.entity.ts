import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../commons/entities/base.entity';
import {
  UploadFileShare,
  UploadFileShares,
  UploadFileType,
  UploadFileTypes,
} from '../../upload-files/upload-files.constant';
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
    type: 'varchar',
    nullable: false,
    enum: UploadFileTypes,
  })
  type?: UploadFileType;

  @Column({
    name: 'share',
    type: 'varchar',
    nullable: false,
    enum: UploadFileShares,
    default: UploadFileShares.public,
  })
  share?: UploadFileShare;
}
