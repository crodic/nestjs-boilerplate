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

  @Column({ type: 'uuid' })
  notificationId: Uuid;

  @Column({ type: 'uuid' })
  userId: Uuid;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
