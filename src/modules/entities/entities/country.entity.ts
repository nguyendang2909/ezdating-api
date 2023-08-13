// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   OneToMany,
//   PrimaryColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// import { State } from './state.entity';

// @Entity()
// export class Country {
//   @PrimaryColumn()
//   id!: number;

//   @Column({ name: 'name', type: 'varchar', nullable: true })
//   name: string;

//   @Column({ name: 'iso3', type: 'varchar', nullable: true })
//   iso3: string;

//   @Column({ name: 'numeric_code', type: 'varchar', nullable: true })
//   numericCode: string;

//   @Column({ name: 'iso2', type: 'varchar', nullable: false, unique: true })
//   iso2: string;

//   @Column({ name: 'phonecode', type: 'varchar', nullable: true })
//   phoneCode: string;

//   @Column({ name: 'capital', type: 'varchar', nullable: true })
//   capital: string;

//   @Column({ name: 'currency', type: 'varchar', nullable: true })
//   currency: string;

//   @Column({ name: 'currency_name', type: 'varchar', nullable: true })
//   currency_name: string;

//   @Column({ name: 'currency_symbol', type: 'varchar', nullable: true })
//   currencySymbol: string;

//   @Column({ name: 'tld', type: 'varchar', nullable: true })
//   tld: string;

//   @Column({ name: 'native', type: 'varchar', nullable: true })
//   native: string;

//   @Column({ name: 'region', type: 'varchar', nullable: true })
//   region: string;

//   @Column({ name: 'subregion', type: 'varchar', nullable: true })
//   subregion: string;

//   @Column({ name: 'translations', type: 'text', nullable: true })
//   translations: string;

//   @Column({ name: 'latitude', type: 'varchar', nullable: true })
//   latitude: string;

//   @Column({ name: 'longitude', type: 'varchar', nullable: true })
//   longitude: string;

//   @Column({ name: 'emoji', type: 'varchar', nullable: true })
//   emoji: string;

//   @Column({ name: 'emojiU', type: 'varchar', nullable: true })
//   emojiU: string;

//   @OneToMany(() => State, (state) => state.country)
//   states?: State[];

//   @Column({ type: 'varchar', nullable: true })
//   @CreateDateColumn({ name: 'created_at', nullable: false })
//   createdAt?: Date;

//   @UpdateDateColumn({ name: 'updated_at', nullable: true })
//   updatedAt?: Date;

//   constructor(obj: Partial<Country>) {
//     Object.assign(this, obj);
//   }
// }
