import { BaseRecord } from './baserecord.type';

export interface Category extends BaseRecord {
  slug: string;
  name: string;
  description: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}
