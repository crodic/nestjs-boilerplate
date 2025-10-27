import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly notificationService: NotificationService) {}

  @SubscribeMessage('createNotification') // Listen event from client
  create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createNotificationDto: CreateNotificationDto,
  ) {
    client.emit('created', { success: true }); // Notification for current client
    this.server.emit('created', `${client.id} is created notification`); // Notification all user
    return this.notificationService.create(createNotificationDto);
  }

  @SubscribeMessage('findAllNotification')
  findAll() {
    return this.notificationService.findAll();
  }

  @SubscribeMessage('findOneNotification')
  findOne(@MessageBody() id: number) {
    return this.notificationService.findOne(id);
  }

  @SubscribeMessage('updateNotification')
  update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(
      updateNotificationDto.id,
      updateNotificationDto,
    );
  }

  @SubscribeMessage('removeNotification')
  remove(@MessageBody() id: number) {
    return this.notificationService.remove(id);
  }
}
