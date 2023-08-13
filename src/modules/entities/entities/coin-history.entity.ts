// import {
//   Column,
//   Entity,
//   Index,
//   JoinColumn,
//   ManyToOne,
//   RelationId,
// } from 'typeorm';

// import { CoinType, CoinTypes } from '../../../commons/constants/constants';
// import { BaseEntity } from '../../../commons/entities/base.entity';
// import { User } from './user.entity';

// @Entity({ name: 'coin_history' })
// @Index('user_id-type-received_at', ['user.id', 'type', 'receivedAt'])
// export class CoinHistory extends BaseEntity {
//   @Column({ name: 'type', type: 'enum', enum: CoinTypes, nullable: false })
//   type!: CoinType;

//   @Column({ name: 'value', type: 'integer', nullable: false })
//   value!: number;

//   @ManyToOne(() => User)
//   @JoinColumn({ name: 'user_id' })
//   user: Partial<User>;

//   @RelationId((coindHistory: CoinHistory) => coindHistory.user)
//   userId: string;

//   @Column({ name: 'received_at', type: 'timestamp', nullable: false })
//   receivedAt: Date;
// }
