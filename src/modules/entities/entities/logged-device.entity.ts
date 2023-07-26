import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DevicePlatform } from '../../../commons/constants/constants';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { User } from './user.entity';

@Entity({ name: 'logged_device' })
export class LoggedDevice extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: Partial<User>;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: false })
  refreshToken!: string;

  @Column({ name: 'expires_in', type: 'timestamp', nullable: false })
  expiresIn!: Date;

  @Column({ name: 'device_id', type: 'varchar', nullable: true })
  deviceId: string;

  @Column({ name: '', type: 'varchar', nullable: true })
  platform: DevicePlatform;
}
