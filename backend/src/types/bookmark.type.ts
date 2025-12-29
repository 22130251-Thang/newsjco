import { BaseRecord } from './baserecord.type';

export interface Bookmark extends BaseRecord {
  userId: number;
  articleSlug: string;
  articleTitle:  string;
  articleImage: string;
  articleCategory: string;
  createdAt: string;
}