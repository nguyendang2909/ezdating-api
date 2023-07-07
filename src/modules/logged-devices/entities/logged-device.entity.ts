import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'logged_device' })
export class LoggedDevice extends CommonEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: Partial<User>;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: false })
  refreshToken!: string;

  @Column({ name: 'expires_in', type: 'timestamp', nullable: false })
  expiresIn!: Date;
}
