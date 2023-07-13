import { Entity } from 'typeorm';

import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity({ name: 'coin_history' })
export class CoinHistory extends BaseEntity {}
