import { Column, Entity, ManyToOne } from 'typeorm';

import { CommonEntity } from '../../../commons/entities/common.entity';
import { User } from '../../users/entities/user.entity';
import { EContactStatus } from '../contacts.constant';

@Entity()
export class Contact extends CommonEntity {
  @ManyToOne(() => User, { nullable: false })
  userOne?: User;

  @ManyToOne(() => User, { nullable: false })
  userTwo?: User;

  @ManyToOne(() => User, { nullable: false })
  requester?: User;

  @Column({ enum: EContactStatus, nullable: false, type: 'varchar' })
  status?: EContactStatus;

  @Column({ nullable: false, type: Date })
  statusAt?: Date;

  constructor(obj: Partial<Contact>) {
    super();
    Object.assign(this, obj);
  }
}
