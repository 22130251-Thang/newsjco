import { BaseRecord } from './baserecord.type';

export interface Article extends BaseRecord {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
  fullContent: string;
  author: string;
  source: string;
  isFeatures?: boolean;
  position: number;
  category: string;
  categories: string[];
  guid: string;
}
