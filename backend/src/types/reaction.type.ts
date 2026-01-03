import { BaseRecord } from './baserecord.type';

export type ReactionType = 'like' | 'dislike';

export interface Reaction extends BaseRecord {
  id: number;
  articleSlug: string;
  userId: number;
  type: ReactionType;
  createdAt: string;
  updatedAt: string;
}

export interface ReactionCount {
  likes: number;
  dislikes: number;
  userReaction: ReactionType | null;
}