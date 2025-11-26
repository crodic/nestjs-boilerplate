import { Uuid } from '@/common/types/common.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { NotificationRecipientEntity } from './notification-recipient.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_notification_id',
  })
  id!: Uuid;

  @Column({ nullable: true, name: 'actor_id' })
  actorId?: Uuid;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata?: any;

  @Column({ type: 'varchar', length: 50, default: 'system' })
  type: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @OneToMany(
    () => NotificationRecipientEntity,
    (recipient) => recipient.notification,
    { cascade: true },
  )
  recipients: Relation<NotificationRecipientEntity[]>;
}
