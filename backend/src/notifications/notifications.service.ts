import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import {
    NotificationsGateway,
    NotificationPayload,
} from './notifications.gateway';
import { BaseRecord } from 'src/types/baserecord.type';

export interface Notification extends BaseRecord {
    userId: number;
    type: string;
    message: string;
    articleSlug: string;
    categorySlug: string;
    commentId: number;
    isRead: boolean;
    createdAt: string;
}

export interface CreateNotificationDto {
    userId: number;
    type: string;
    message: string;
    articleSlug: string;
    categorySlug: string;
    commentId: number;
}

@Injectable()
export class NotificationsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly usersService: UsersService,
        private readonly notificationsGateway: NotificationsGateway,
    ) { }

    create(createNotificationDto: CreateNotificationDto): Notification {
        const newNotification = {
            userId: createNotificationDto.userId,
            type: createNotificationDto.type,
            message: createNotificationDto.message,
            articleSlug: createNotificationDto.articleSlug,
            categorySlug: createNotificationDto.categorySlug,
            commentId: createNotificationDto.commentId,
            isRead: false,
            createdAt: new Date().toISOString(),
        };

        const savedNotification = this.databaseService.create<Notification>(
            'notifications',
            newNotification,
        );

        this.notificationsGateway.sendNotificationToUser(
            savedNotification.userId,
            savedNotification as NotificationPayload,
        );

        return savedNotification;
    }

    findByUserId(userId: number): Notification[] {
        const allNotifications =
            this.databaseService.findAll<Notification>('notifications');
        return allNotifications
            .filter((n) => n.userId === userId)
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
    }

    getUnreadCount(userId: number): number {
        const notifications = this.findByUserId(userId);
        return notifications.filter((n) => !n.isRead).length;
    }

    markAsRead(id: number): Notification {
        return this.databaseService.update<Notification>('notifications', id, {
            isRead: true,
        });
    }

    markAllAsRead(userId: number): void {
        const notifications = this.findByUserId(userId);
        notifications
            .filter((n) => !n.isRead)
            .forEach((n) => {
                this.databaseService.update<Notification>('notifications', n.id, {
                    isRead: true,
                });
            });
    }
}
