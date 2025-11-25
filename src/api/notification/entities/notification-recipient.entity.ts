import { Uuid } from '@/common/types/common.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity('notification-recipients')
export class NotificationRecipientEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_notification_recipient_id',
  })
  id!: Uuid;

  @ManyToOne(
    () => NotificationEntity,
    (notification) => notification.recipients,
    {
      onDelete: 'CASCADE',
    },
  )
  notification: NotificationEntity;

  @Column({ name: 'notification_id' })
  notificationId: Uuid;

  @Column({ name: 'user_id' })
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
