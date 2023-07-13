import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Country } from './country.entity';

@Entity()
export class State {
  @PrimaryColumn()
  id!: number;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name?: string;

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @Column({ type: 'varchar', nullable: true })
  countryCode?: string;

  @Column({ name: 'iso2', type: 'varchar', nullable: true })
  iso2?: string;

  @Column({ name: 'type', type: 'varchar', nullable: true })
  type: string;

  @Column({ name: 'latitude', type: 'varchar', nullable: true })
  latitude: string;

  @Column({ name: 'longitude', type: 'varchar', nullable: true })
  longitude: string;

  @Column({ type: 'varchar', nullable: true })
  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  constructor(obj: Partial<State>) {
    Object.assign(this, obj);
  }
}
