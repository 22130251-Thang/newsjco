import { BaseRecord } from './baserecord.type';

export interface User extends BaseRecord {
  username: string;
  useremail: string;
  password: string;
  displayName: string;
  role?: string;
  avatar?: string;
  bio?: string;
  theme?: 'light' | 'dark';
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  phone?: string;
  address?: string;
  subscribedCategories?: string[];
  createdAt?: string;
  updatedAt?: string;
}
