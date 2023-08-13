// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   Index,
//   JoinColumn,
//   ManyToOne,
//   PrimaryColumn,
//   RelationId,
//   UpdateDateColumn,
// } from 'typeorm';

// import {
//   RelationshipUserStatus,
//   RelationshipUserStatuses,
// } from '../../../commons/constants/constants';
// import { User } from './user.entity';

// @Entity({ name: 'relationship' })
// @Index('conversations', [
//   'lastMessageAt',
//   'userOneStatus',
//   'userTwoStatus',
//   'userOne.id',
//   'userTwo.id',
// ])
// export class Relationship {
//   @PrimaryColumn('varchar')
//   id!: string;

//   @ManyToOne(() => User, { nullable: false })
//   @JoinColumn({ name: 'user_one_id' })
//   userOne!: Partial<User>;

//   @RelationId((relationship: Relationship) => relationship.userOne)
//   userOneId!: string;

//   @ManyToOne(() => User, { nullable: false })
//   @JoinColumn({ name: 'user_two_id' })
//   userTwo!: Partial<User>;

//   @RelationId((relationship: Relationship) => relationship.userTwo)
//   userTwoId!: string;

//   @Column({
//     name: 'user_one_status',
//     nullable: true,
//     type: 'enum',
//     enum: RelationshipUserStatuses,
//     default: RelationshipUserStatuses.viewed,
//   })
//   userOneStatus?: RelationshipUserStatus;

//   @Column({
//     name: 'user_two_status',
//     nullable: true,
//     type: 'enum',
//     enum: RelationshipUserStatuses,
//     default: RelationshipUserStatuses.viewed,
//   })
//   userTwoStatus?: RelationshipUserStatus;

//   @Column({ name: 'status_at', type: 'timestamp', nullable: true })
//   statusAt?: Date;

//   @Column({ name: 'user_one_status_at', type: 'timestamp', nullable: true })
//   userOneStatusAt: Date;

//   @Column({ name: 'user_two_status_at', type: 'timestamp', nullable: true })
//   userTwoStatusAt: Date;

//   @Column({
//     name: 'can_user_one_chat',
//     nullable: true,
//     type: 'boolean',
//   })
//   canUserOneChat?: boolean;

//   @Column({
//     name: 'can_user_two_chat',
//     nullable: true,
//     type: 'boolean',
//   })
//   canUserTwoChat?: boolean;

//   @Column({
//     name: 'last_message',
//     nullable: true,
//     type: 'text',
//   })
//   lastMessage?: string;

//   @Column({
//     name: 'last_message_at',
//     nullable: true,
//     type: 'timestamp',
//   })
//   lastMessageAt?: Date;

//   @Column({
//     name: 'last_message_by',
//     nullable: true,
//     type: 'uuid',
//   })
//   lastMessageBy?: string;

//   @Column({
//     name: 'last_message_read',
//     nullable: true,
//     type: 'boolean',
//   })
//   lastMessageRead?: boolean;

//   @CreateDateColumn({ name: 'created_at', nullable: false })
//   createdAt?: Date;

//   @UpdateDateColumn({ name: 'updated_at', nullable: true })
//   updatedAt?: Date;

//   @Column({ name: 'created_by', type: 'uuid', nullable: false })
//   createdBy!: string;

//   @Column({ name: 'updated_by', type: 'uuid', nullable: true })
//   updatedBy?: string;
// }
