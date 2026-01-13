import { BaseRecord } from './baserecord.type';

export interface Notification extends BaseRecord {
  userId: number;
  type: 'reply' | 'new_article' | 'system' | string;
  message: string;
  articleSlug: string;
  categorySlug: string;
  commentId?: number;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationDto {
  userId: number;
  type: string;
  message: string;
  articleSlug: string;
  categorySlug: string;
  commentId?: number;
}