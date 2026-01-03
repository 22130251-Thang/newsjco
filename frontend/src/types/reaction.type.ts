export type ReactionType = 'like' | 'dislike';

export interface Reaction {
  id: number;
  articleSlug: string;
  userId: number;
  type: ReactionType;
  createdAt: string;
  updatedAt: string;
}

export interface ReactionCount {
  likes:  number;
  dislikes: number;
  userReaction: ReactionType | null;
}

export interface ToggleReactionResponse {
  action:  'created' | 'removed' | 'changed';
  reaction: Reaction | null;
  counts: ReactionCount;
}