import { BaseRecord } from './baserecord.type';

export interface ViewHistory extends BaseRecord {
  userId: number;
  articleSlug: string;
  viewedAt: string;
}
