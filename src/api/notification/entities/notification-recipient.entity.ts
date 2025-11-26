import { Uuid } from '@/common/types/common.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity('notification-recipients')
export class NotificationRecipientEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_notification_recipient_id',
  })
  id!: Uuid;

  @JoinColumn({
    name: 'notification_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_recipient_notification_id',
  })
  @ManyToOne(
    () => NotificationEntity,
    (notification) => notification.recipients,
    {
      onDelete: 'CASCADE',
    },
  )
  notification: Relation<NotificationEntity>;

  @Column({ name: 'notification_id', type: 'uuid' })
  notificationId: Uuid;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: Uuid;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;
}
