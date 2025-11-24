import { Uuid } from '@/common/types/common.type';
import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private service: NotificationService) {}

  @Get(':userId')
  getNotifications(@Param('userId') userId: Uuid) {
    return this.service.getUserNotifications(userId);
  }

  @Patch(':notificationId/read/:userId')
  markRead(
    @Param('notificationId') notificationId: Uuid,
    @Param('userId') userId: Uuid,
  ) {
    return this.service.markAsRead(notificationId, userId);
  }
}
