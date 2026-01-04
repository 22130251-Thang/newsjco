import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

export interface NotificationPayload {
  id: number;
  userId: number;
  type: string;
  message: string;
  articleSlug: string;
  categorySlug: string;
  commentId: number;
  isRead: boolean;
  createdAt: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user_${userId}`);
      this.logger.log(`Client connected: ${client.id}, userId: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendNotificationToUser(userId: number, notification: NotificationPayload) {
    this.server.to(`user_${userId}`).emit('newNotification', notification);
    this.logger.log(`Notification sent to user_${userId}`);
  }

  @SubscribeMessage('joinArticle')
  handleJoinArticle(client: Socket, slug: string) {
    client.join(`article_${slug}`);
    this.logger.log(`Client ${client.id} joined article_${slug}`);
  }

  @SubscribeMessage('leaveArticle')
  handleLeaveArticle(client: Socket, slug: string) {
    client.leave(`article_${slug}`);
    this.logger.log(`Client ${client.id} left article_${slug}`);
  }

  sendCommentToArticle(slug: string, comment: any) {
    this.server.to(`article_${slug}`).emit('newComment', comment);
    this.logger.log(`Comment sent to article_${slug}`);
  }
}
