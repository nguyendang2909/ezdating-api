// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   RelationId,
// } from 'typeorm';

// import { BaseEntity } from '../../../commons/entities/base.entity';
// import { Relationship } from './relationship.entity';
// import { User } from './user.entity';

// @Entity()
// export class Message extends BaseEntity {
//   @Column({ name: 'audio', type: 'varchar', nullable: true })
//   audio?: string;

//   @OneToOne(() => Message, { nullable: true })
//   @JoinColumn({ name: 'reply_message' })
//   replyMessage?: Message;

//   @ManyToOne(() => Relationship, { nullable: false })
//   @JoinColumn({ name: 'relationship_id' })
//   relationship!: Partial<Relationship>;

//   @ManyToOne(() => User, { nullable: false })
//   @JoinColumn({ name: 'user_id' })
//   user: Partial<User>;

//   @RelationId((message: Message) => message.user)
//   userId: string;

//   @Column({ type: 'varchar', nullable: true })
//   image?: string;

//   @Column({ array: true, type: 'uuid', nullable: true })
//   likeUserIds?: string[];

//   @Column({ array: true, type: 'uuid', nullable: true })
//   loveUserIds?: string[];

//   @Column({ type: 'varchar', nullable: true })
//   text?: string;

//   @Column({ type: 'varchar', nullable: true })
//   video?: string;

//   @Column({ type: 'uuid', nullable: false })
//   uuid: string;
// }
