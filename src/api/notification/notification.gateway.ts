import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway {
  @WebSocketServer() server: Server;

  private onlineUsers = new Map<string, number>();

  constructor(private readonly notificationService: NotificationService) {}

  sendToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId) return;

    client.join(`user_${userId}`);

    const count = this.onlineUsers.get(userId) || 0;
    this.onlineUsers.set(userId, count + 1);

    this.sendOnlineCount();

    console.log(`User ${userId} connected.`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId) return;

    const count = this.onlineUsers.get(userId) || 0;
    if (count <= 1) {
      this.onlineUsers.delete(userId);
    } else {
      this.onlineUsers.set(userId, count - 1);
    }

    this.sendOnlineCount();

    console.log(`User ${userId} disconnected.`);
  }

  getOnlineCount() {
    return this.onlineUsers.size;
  }

  sendOnlineCount() {
    this.server.emit('onlineCount', this.getOnlineCount());
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(client: Socket, payload: any) {
    await this.notificationService.markAsRead(
      payload.notificationId,
      payload.userId,
    );

    client.emit('markReadSuccess', payload.notificationId);
  }
}
