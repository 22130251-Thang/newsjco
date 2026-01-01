import { BaseRecord } from 'src/types/baserecord.type';

export interface Comment extends BaseRecord {
    articleSlug: string;
    userId: number;
    content: string;
    likes: number;
    dislikes: number;
    status: CommentStatus;
    createdAt: string;
    updatedAt: string;
    parentId?: number;
}

export interface CommentWithUser extends Comment {
    user: any;
    userReaction?: ReactionType | null;
}

export type CommentStatus = 'approved' | 'pending' | 'rejected';
export type ReactionType = 'like' | 'dislike';

export interface CommentReaction extends BaseRecord {
    commentId: number;
    userId: number;
    type: ReactionType;
}
