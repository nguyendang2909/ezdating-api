import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';
import { EUploadFileShare, EUploadFileType } from '../upload-files.constant';

@Entity({ name: 'upload_file' })
export class UploadFile extends CommonEntity {
  @Column({ name: 'key', type: 'varchar', nullable: false })
  key?: string;

  @Column({ name: 'location', type: 'varchar', nullable: false })
  location?: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({
    name: 'type',
    type: 'varchar',
    nullable: false,
    enum: EUploadFileType,
  })
  type?: EUploadFileType;

  @Column({
    name: 'share',
    type: 'smallint',
    nullable: false,
    enum: EUploadFileShare,
    default: EUploadFileShare.public,
  })
  share?: EUploadFileShare;
}
