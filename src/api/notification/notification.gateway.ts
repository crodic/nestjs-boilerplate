import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway()
export class NotificationGateway {
  private onlineUsers = new Set<string>();

  @WebSocketServer() server: Server;
  constructor(private readonly notificationService: NotificationService) {}

  sendToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user_${userId}`);
      this.onlineUsers.add(userId);
      this.sendOnlineCount();
      console.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.delete(userId);
      client.leave(`user_${userId}`);
      console.log(`User ${userId} disconnected`);
    }
  }

  getOnlineCount() {
    return this.onlineUsers.size;
  }

  sendOnlineCount() {
    this.server.emit('onlineCount', this.getOnlineCount());
  }
}
