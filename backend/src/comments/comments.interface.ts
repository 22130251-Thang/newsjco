import { BaseRecord } from 'src/types/baserecord.type';

export interface Comment extends BaseRecord {
    articleGuid: string;
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
    user: unknown;
}

export type CommentStatus = 'approved' | 'pending' | 'rejected';
